'use strict';
const winston = require('winston');

const logger = new (winston.Logger)({
    transports: [
        // colorize the output to the console
        new (winston.transports.Console)({
            colorize: true,
        })
    ]
});

module.exports = logger;