const defaults = require('./defaults');

class Config {

    constructor(settings) {

        this.setServiceName(settings.SERVICE_NAME || defaults.service_name);
        this.setServicePort(settings.SERVICE_PORT || defaults.service_port);
        this.setLogLevel(settings.LOG_LEVEL || defaults.logging_level);
        this.setQuandlApiEndpoint(settings.QUANDL_API_ENDPOINT || defaults.quandl_api_endpoint);
        this.setQuandlApiVersion(settings.QUANDL_API_VERSION || defaults.quandl_api_version);

        if (settings.QUANDL_AUTH_TOKEN) this.setQuandlAuthToken(settings.QUANDL_AUTH_TOKEN);
        else throw Error("QUANDL_AUTH_TOKEN is not set");

    }

    setServiceName(serviceName){
        this.service_name = serviceName;
    }

    setServicePort(servicePort){
        this.service_port = servicePort;
    }

    setLogLevel(logLevel){
        this.log_level = logLevel;
    }

    setQuandlApiEndpoint(apiEndpoint){
        this.api_endpoint = apiEndpoint;
    }

    setQuandlApiVersion(apiVersion){
        this.api_version = apiVersion;
    }

    setQuandlAuthToken(authToken){
        this.auth_token = authToken
    }

}

module.exports = Config;
