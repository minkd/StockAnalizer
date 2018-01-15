const should = require('chai').should();
const Config = require("../../../src/config");

const defaults = require("../../../src/config/defaults");

describe('Config Test Suite', function () {

    it('Config should error when QUANDL_AUTH_TOKEN is not set', function () {


        delete process.env.QUANDL_AUTH_TOKEN;

        try {
            const config = new Config(process.env);
        } catch (e){
            // should throw an error here
            e.should.not.be.undefined;
        }

    });

    it('Should setup defaults', function () {

        delete process.env.SERVICE_NAME;
        delete process.env.SERVICE_PORT;
        delete process.env.LOG_LEVEL;
        delete process.env.QUANDL_API_ENDPOINT;
        delete process.env.QUANDL_API_VERSION;
        process.env.QUANDL_AUTH_TOKEN = "test";

        const config = new Config(process.env);


        config.service_name.should.equal(defaults.service_name);
        config.service_port.should.equal(defaults.service_port);
        config.log_level.should.equal(defaults.logging_level);
        config.api_endpoint.should.equal(defaults.quandl_api_endpoint);
        config.api_version.should.equal(defaults.quandl_api_version);
        config.auth_token.should.equal("test");

    });

    it('Should set up the configuration object', function () {

        const testSettings = {
            service_name: "test_name",
            service_port: "1",
            log_level: "test_level",
            api_endpoint: "test_endpoint",
            api_version: "test_version",
            auth_token: "test_token"
        };

        process.env.SERVICE_NAME = testSettings.service_name;
        process.env.SERVICE_PORT = testSettings.service_port;
        process.env.LOG_LEVEL = testSettings.log_level;
        process.env.QUANDL_API_ENDPOINT = testSettings.api_endpoint;
        process.env.QUANDL_API_VERSION = testSettings.api_version;
        process.env.QUANDL_AUTH_TOKEN = testSettings.auth_token;

        const config = new Config(process.env);

        config.service_name.should.equal(testSettings.service_name);
        config.service_port.should.equal(testSettings.service_port);
        config.log_level.should.equal(testSettings.log_level);
        config.api_endpoint.should.equal(testSettings.api_endpoint);
        config.api_version.should.equal(testSettings.api_version);
        config.auth_token.should.equal(testSettings.auth_token);

    });



});