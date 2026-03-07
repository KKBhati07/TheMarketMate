import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import https from 'node:https';
import fs from 'node:fs';

import bootstrap from './src/main.server';
import { bootstrapLogger } from '@marketmate/shared';

/**
 * In-memory SSR cache
 * Key = URL, Value = rendered HTML
 * (Can be replaced by Redis later)
 */
const ssrCache = new Map<string, string>();

export function app(): express.Express {
	const server = express();

	const serverDistFolder = dirname(fileURLToPath(import.meta.url));
	const browserDistFolder = resolve(serverDistFolder, '../browser');
	const indexHtml = join(serverDistFolder, 'index.server.html');

	const commonEngine = new CommonEngine();

	// ---- Security headers (CSP etc) ----
	server.use(
			helmet({
				contentSecurityPolicy: {
					directives: {
						defaultSrc: ["'self'"],
						connectSrc: [
							"'self'",
							"https://api.marketmate.local:8080", // allow API calls
							"https://api.marketmatecloud.in"
						],
						scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
						scriptSrcAttr: ["'unsafe-inline'"],
						styleSrc: ["'self'", "'unsafe-inline'"],
						imgSrc: ["'self'", "data:", "https:"],
						fontSrc: ["'self'", "https:", "data:"],
					},
				},
			})
	);

	server.use(compression()); // gzip responses

	// ---- Health check endpoint ----
	server.get('/health', (_, res) => {
		res.status(200).send('OK');
	});

	/**
	 * Serve static files first.
	 * index:false is CRITICAL so Angular routes
	 * don't return index.html as JS/CSS.
	 */
	server.use(
			express.static(browserDistFolder, {
				index: false,
				maxAge: '1y',
			})
	);

	// ---- SSR handler (all routes) ----
	server.get('/{*path}', async (req, res, next): Promise<void> => {
		try {
			const { protocol, originalUrl, baseUrl, headers } = req;
			const fullUrl = `${protocol}://${headers.host}${originalUrl}`;

			// Serve from cache if exists
			if (ssrCache.has(originalUrl)) {
				res.setHeader('Cache-Control', 'public, max-age=300'); // 5 min
				res.send(ssrCache.get(originalUrl)!);
				return;
			}

			// Render Angular on server
			const html = await commonEngine.render({
				bootstrap,
				documentFilePath: indexHtml,
				url: fullUrl,
				publicPath: browserDistFolder,
				providers: [
					{ provide: APP_BASE_HREF, useValue: baseUrl },
				],
			});

			// Cache rendered HTML
			ssrCache.set(originalUrl, html);
			res.setHeader('Cache-Control', 'public, max-age=300');

			res.send(html);
		} catch (err) {
			next(err);
		}
	});

	// ---- Global error boundary ----
	server.use((err: any, req: any, res: any, next: any) => {
		bootstrapLogger.error('SSR Error', err);
		res.status(500).send('Internal Server Error');
	});

	return server;
}

// ---- Bootstrap HTTPS server ----
function run(): void {

	const port = process.env['PORT'] || 4000;
	const server = app();

	const isDev = process.env['NODE_ENV'] !== 'production';

	if (isDev) {

		/**
		 * HTTPS certificates for local SSL
		 * (used to simulate real prod environment)
		 */
		const httpsOptions = {
			key: fs.readFileSync('/certs/wildcard.marketmate.local-key.pem'),
			cert: fs.readFileSync('/certs/wildcard.marketmate.local.pem'),
		};

		https.createServer(httpsOptions, server).listen(port, () => {
			bootstrapLogger.info(
					`Dev HTTPS server running at https://marketmate.local:${port}`
			);
		});

	} else {

		server.listen(port, () => {
			bootstrapLogger.info(
					`Production server running at http://0.0.0.0:${port}`
			);
		});

	}
}

run();
