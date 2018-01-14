const status = require('http-status');
const { PriceCalculator } = require('../../controller/PriceCalculator');
const quandl = require('../../../services').Quandl.getConnection();

/**
 * @apiDefine BusiestDay
 *
 * @apiParam (Query) {Number} security The securities to query for.
 * @apiParam (Query) {Number} date Restrict results to a specific date (yyyy-mm-dd).
 * @apiParam (Query) {Number} start_date Restrict results to dates greater than this date (yyyy-mm-dd).
 * @apiParam (Query) {Number} end_date Restrict results to dates less than this date (yyyy-mm-dd).
 *
 * @apiSuccess (Response) {Object[]} BusiestDay An array of objects with the busiest day for each requested security.
 * @apiSuccess (Response) {String} BusiestDay.ticker The security code.
 * @apiSuccess (Response) {String} BusiestDay.date The date of high performance.
 * @apiSuccess (Response) {Number} BusiestDay.volume The volume for this day.
 * @apiSuccess (Response) {Number} BusiestDay.average_volume The average volume over the span of this query.
 *
 * @apiExample {HTTP} Example usage:
 * http://localhost:3600/stockprices/busiest_day?security=GOOGL&security=MSFT&start_date=2017-01-01&end_date=2017-01-05
 *
 * @apiSuccessExample {json} Success-Response:
 * [{"ticker":"GOOGL","date":"2017-01-03","volume":1959033,"average_volume":1604969},{"ticker":"MSFT","date":"2017-01-05","volume":24875968,"average_volume":22303346}]
 */
module.exports = (req, res) => {

    const options = {};

    if (req.query.security) options['ticker[]'] = req.query.security;
    if (req.query.date) options['date'] = req.query.date;
    if (req.query.start_date) options['date.gte'] = req.query.start_date;
    if (req.query.end_date) options['date.lte'] = req.query.end_date;

    quandl.getDataTable("WIKI", "PRICES", options, ['ticker', 'date', 'volume'])
        .then(function(result){
            res.json(PriceCalculator.busyDay(result));
        })
        .catch(function(error){
            res.status(status.INTERNAL_SERVER_ERROR).send(error);
        });
};