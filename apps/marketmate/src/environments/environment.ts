const envDev = {
	production: false,
	// apiUrl: 'http://localhost:8080/api/',
	apiUrl: 'https://api.marketmate.local:8080/api/',
	adminAppUrl: 'https://admin.marketmate.local:4300/',
};

const envProd = {
	production: false,
	apiUrl: 'https://api.marketmatecloud.in/api/',
	adminAppUrl: 'https://admin.marketmatecloud.in',
};

export const environment = envDev
// export const environment = envProd
