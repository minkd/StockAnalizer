const status = require('http-status');
const {PriceCalculator} = require('../../controller/PriceCalculator');
const quandl = require('../../../services').Quandl.getConnection();

/**
 * @apiDefine BiggestLoser
 *
 * @apiParam (Query) {Number} security The securities to query for.
 * @apiParam (Query) {Number} date Restrict results to a specific date (yyyy-mm-dd).
 * @apiParam (Query) {Number} start_date Restrict results to dates greater than this date (yyyy-mm-dd).
 * @apiParam (Query) {Number} end_date Restrict results to dates less than this date (yyyy-mm-dd).
 *
 * @apiSuccess (Response) {String} ticker The security code.
 * @apiSuccess (Response) {Number} num_loser_days The number of days the close price was less than the open price.
 *
 * @apiExample {HTTP} Example usage:
 * http://localhost:3600/stockprices/biggest_loser?security=GOOGL&security=MSFT&start_date=2017-01-01&end_date=2017-01-05
 *
 * @apiSuccessExample {json} Success-Response:
 * {"ticker":"MSFT","num_loser_days":2}
 */
module.exports = (req, res) => {

    const options = {};

    if (req.query.security) options['ticker[]'] = req.query.security;
    else res.status(status.BAD_REQUEST).send({reason: "A least on security is required"});

    if (req.query.date) options['date'] = req.query.date;
    if (req.query.start_date) options['date.gte'] = req.query.start_date;
    if (req.query.end_date) options['date.lte'] = req.query.end_date;

    quandl.getDataTable("WIKI", "PRICES", options, ['ticker', 'date', 'open', 'close'])
        .then(function (result) {
            res.json(PriceCalculator.biggestLoser(result));
        })
        .catch(function (error) {
            res.status(status.INTERNAL_SERVER_ERROR).send(error);
        });
};