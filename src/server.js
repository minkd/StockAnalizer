const config = require("./config");
const path = require('path');
const express = require('express');
const app = express();

// Initialize 3rd party services
const services = require('./services/index');
services.init({ Quandl: config });

/**
 * @api {get} / Application Name
 * @apiVersion 0.0.1
 * @apiGroup Common
 * @apiUse Root
 */
app.get('/', require('./server/routes/common/root'));

/**
 * @api {get} /health Health Check
 * @apiVersion 0.0.1
 * @apiGroup Common
 * @apiUse Health
 */
app.get('/health', require('./server/routes/common/healthCheck'));

/**
 * @api {get} /stockprices/monthly_average Monthly Average
 * @apiVersion 0.0.1
 * @apiGroup StockPrices
 * @apiUse MonthlyAverage
 */
app.get('/stockprices/monthly_average/', require('./server/routes/stockprices/getMonthlyAverageOpenClose'));

/**
 * @api {get} /stockprices/max_daily_profit Max Daily Profit
 * @apiVersion 0.0.1
 * @apiGroup StockPrices
 * @apiUse MaxProfit
 */
app.get('/stockprices/max_daily_profit', require('./server/routes/stockprices/getMaxDailyProfit'));

/**
 * @api {get} /stockprices/busiest_day Busiest Day
 * @apiVersion 0.0.1
 * @apiGroup StockPrices
 * @apiUse BusiestDay
 */
app.get('/stockprices/busiest_day', require('./server/routes/stockprices/getBusiestDay'));

/**
 * @api {get} /stockprices/biggest_loser Biggest Loser
 * @apiVersion 0.0.1
 * @apiGroup StockPrices
 * @apiUse BiggestLoser
 */
app.get('/stockprices/biggest_loser', require('./server/routes/stockprices/getBiggestLoser'));

// Common catch all
app.use(require('./server/routes/common/invalidRoute'));

// A route to publish api documentation
app.use('/docs', express.static(path.join(__dirname, '../docs/api')));

// Start the server
app.listen(process.env.PORT || 3600, () => console.log(`Listening on port ${process.env.PORT || 3600}!`));