const status = require('http-status');

/**
 * @apiDefine InvalidCatchAll
 *
 * @apiSuccess (Response) {String} error.
 *
 * @apiExample {HTTP} Example usage:
 * http://localhost:3600/some/invalid/route
 *
 * @apiError NotFound The resource was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "NotFound"
 *     }
 */
module.exports = (req, res) => {
    res.status(status.NOT_FOUND).send({error: "NotFound"});
};