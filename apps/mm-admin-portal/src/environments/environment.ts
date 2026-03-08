const envDev = {
	production: false,
	// apiUrl: 'http://localhost:8080/api/',
	apiUrl: 'https://api.marketmate.local:8080/api/',
	emailEnabled: true,
};

const envProd = {
	production: false,
	apiUrl: 'https://api.marketmatecloud.in/api/',
	emailEnabled: true,
};

export const environment = envDev
// export const environment = envProd
