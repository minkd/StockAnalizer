const status = require('http-status');
const { PriceCalculator } = require('../../controller/PriceCalculator');
const quandl = require('../../../services').Quandl.getConnection();

/**
 * @apiDefine MonthlyAverage
 *
 * @apiParam (Query) {Number} security The securities to query for.
 * @apiParam (Query) {Number} date Restrict results to a specific date (yyyy-mm-dd).
 * @apiParam (Query) {Number} start_date Restrict results to dates greater than this date (yyyy-mm-dd).
 * @apiParam (Query) {Number} end_date Restrict results to dates less than this date (yyyy-mm-dd).
 *
 * @apiSuccess (Response) {Object[]} MonthlyAverage An array of securities rolled up to monthly averages.
 * @apiSuccess (Response) {String} MonthlyAverage.ticker The security code.
 * @apiSuccess (Response) {Object[]} MonthlyAverage.monthly_stats An array of rolled up statistics.
 * @apiSuccess (Response) {String} MonthlyAverage.monthly_stats.month The month being rolled up.
 * @apiSuccess (Response) {Number} MonthlyAverage.monthly_stats.average_open Average open price for this month.
 * @apiSuccess (Response) {Number} MonthlyAverage.monthly_stats.average_close Average close price for this month.
 *
 * @apiExample {HTTP} Example usage:
 * http://localhost:3600/stockprices/monthly_average?security=GOOGL&security=MSFT&start_date=2017-01-01&end_date=2017-01-05
 *
 * @apiSuccessExample {json} Success-Response:
 * [{"ticker":"GOOGL","monthly_stats":[{"month":"2017-01","average_open":806.0033333333334,"average_close":809.6}]},{"ticker":"MSFT","monthly_stats":[{"month":"2017-01","average_open":62.48666666666666,"average_close":62.39333333333334}]}]
 */
module.exports = (req, res) => {

    const options = {};

    if (req.query.security) options['ticker[]'] = req.query.security;
    else res.status(status.BAD_REQUEST).send({reason: "A least on security is required"});

    if (req.query.date) options['date'] = req.query.date;
    if (req.query.start_date) options['date.gte'] = req.query.start_date;
    if (req.query.end_date) options['date.lte'] = req.query.end_date;

    quandl.getDataTable("WIKI", "PRICES", options, ['ticker', 'date', 'open', 'close'])
        .then(function(result){
            res.json(PriceCalculator.averageMonthlyRollup(result));
        })
        .catch(function(error){
            res.status(status.INTERNAL_SERVER_ERROR).send(error);
        });
};