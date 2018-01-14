const status = require('http-status');
const { PriceCalculator } = require('../../controller/PriceCalculator');
const quandl = require('../../../services').Quandl.getConnection();




/**
 * @apiDefine MaxProfit
 *
 * @apiParam (Query) {Number} security The securities to query for.
 * @apiParam (Query) {Number} date Restrict results to a specific date (yyyy-mm-dd).
 * @apiParam (Query) {Number} start_date Restrict results to dates greater than this date (yyyy-mm-dd).
 * @apiParam (Query) {Number} end_date Restrict results to dates less than this date (yyyy-mm-dd).
 *
 * @apiSuccess (Response) {Object[]} MaxProfit List of biggest_loser
 * @apiSuccess (Response) {String} MaxProfit.ticker The security code.
 * @apiSuccess (Response) {String} MaxProfit.date The date this security performed the best over a given date filter
 * @apiSuccess (Response) {Number} MaxProfit.daily_max The largest gain for this security over the given filter.
 *
 * @apiExample {HTTP} Example usage:
 * http://localhost:3600/stockprices/max_daily_profit/?security=GOOGL&security=MSFT&start_date=2017-01-01&end_date=2017-01-05
 *
 * @apiSuccessExample {json} Success-Response:
 * [{"ticker":"GOOGL","date":"2013-10-18","daily_max":34.82999999999993},{"ticker":"MSFT","date":"2015-04-24","daily_max":2.210000000000001}]
 */
module.exports = (req, res) => {

    const options = {};

    if (req.query.security) options['ticker[]'] = req.query.security;
    if (req.query.date) options['date'] = req.query.date;
    if (req.query.start_date) options['date.gte'] = req.query.start_date;
    if (req.query.end_date) options['date.lte'] = req.query.end_date;

    quandl.getDataTable("WIKI", "PRICES", options, ['ticker', 'date', 'open', 'close'])
        .then(function(result){
            res.json(PriceCalculator.maxDailyRollup(result));
        })
        .catch(function(error){
            res.status(status.INTERNAL_SERVER_ERROR).send(error);
        });
};