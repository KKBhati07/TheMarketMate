const envDev = {
	production: false,
	apiUrl: 'http://localhost:8080/api/',
	adminUrl: 'http://localhost:4300',
};

const envProd = {
	production: false,
	apiUrl: 'https://.api.marketmate.com/',
	adminUrl: 'https://admin.marketmate.com',
};

export const environment = envDev
// export const environment = envProd
