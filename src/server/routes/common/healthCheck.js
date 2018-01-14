const status = require('http-status');

/**
 * @apiDefine Health
 *
 * @apiSuccess (Response) {String} status The application status.
 *
 * @apiExample {HTTP} Example usage:
 * http://localhost:3600/health
 *
 * @apiSuccessExample {json} Success-Response:
 * {"status":"OK"}
 */
module.exports = (req, res) => {
    res.status(status.OK).send({"status":"OK"});
};