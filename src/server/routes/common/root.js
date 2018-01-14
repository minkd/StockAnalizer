const status = require('http-status');

/**
 * @apiDefine Root
 *
 * @apiSuccess (Response) {String} service_name The name of the application.
 *
 * @apiExample {HTTP} Example usage:
 * http://localhost:3600
 *
 * @apiSuccessExample {json} Success-Response:
 * {"service_name":"StockAnalyzer!!"}
 */
module.exports = (req, res) => {
    res.status(status.OK).send({ service_name: 'StockAnalyzer!!'} );
};