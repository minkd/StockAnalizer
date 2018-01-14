const config = require('../config');

const winston = require('winston');
winston.emitErrs = true;

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: config.log_level ,
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};