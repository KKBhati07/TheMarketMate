const envDev = {
	production: false,
	// apiUrl: 'http://localhost:8080/api/',
	apiUrl: 'https://api.marketmate.local:8080/api/',
	adminAppUrl: 'https://admin.marketmate.local:4300/',
};

const envProd = {
	production: false,
	apiUrl: 'https://springmate.onrender.com/api/',
	adminAppUrl: 'https://admin.marketmate.com',
};

export const environment = envDev
// export const environment = envProd
