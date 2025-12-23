const envDev = {
	production: false,
	// apiUrl: 'http://localhost:8080/api/',
	apiUrl: 'https://api.marketmate.local:8080/api/',
};

const envProd = {
	production: false,
	apiUrl: 'https://.api.abcc.com/',
};

export const environment = envDev
// export const environment = envProd
