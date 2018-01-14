const settings = {};

if (process.env.SERVICE_NAME) settings.port = process.env.SERVICE_NAME;
else settings.name = "StockAnalyzer";

if (process.env.PORT) settings.port = process.env.PORT;
else settings.port = 3600;

if (process.env.LOG_LEVEL) settings.port = process.env.LOG_LEVEL;
else settings.log_level = "info";

if (process.env.QUANDL_API_ENDPOINT) settings.api_endpoint = process.env.QUANDL_API_ENDPOINT;
else settings.api_endpoint = "https://www.quandl.com/api";

if (process.env.QUANDL_API_VERSION) settings.api_version = process.env.QUANDL_API_VERSION;
else settings.api_version = "v3";

if (process.env.QUANDL_AUTH_TOKEN) settings.auth_token = process.env.QUANDL_AUTH_TOKEN;
else throw Error("Must provide {QUANDL_AUTH_TOKEN}");



module.exports = settings;
