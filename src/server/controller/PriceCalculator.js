const d3 = require("d3");

/**
 * The PriceCalculator class works with {module:~ResultSet}. This class houses a collection of algorithms to analise
 * stock market prices.
 *
 * @class PriceCalculator
 */
class PriceCalculator {

    /**
     * For each (security, month), calculate the average open and close prices.
     *
     * @param resultSet { [DataTableResultSet] }
     * @returns { [{ ticker: {month: string, average_open: string, average_close: string }}] }
     */
    static averageMonthlyRollup(resultSet) {

        return d3.nest()
            .key(function (d) {
                return d.ticker
            })
            .key(function (d) {
                // Save month to ResultSet
                d.month = parseMonth(d.date);
                // Add month to nest
                return d.month;
            })
            .rollup(function (d) {
                return {
                    average_open: d3.mean(d, function (e) {
                        return e.open;
                    }),
                    average_close: d3.mean(d, function (e) {
                        return e.close;
                    })
                };
            })
            .entries(resultSet)
            .map(averageMonthlyRollupFormat);

    }

    /**
     * For each security, calculate the most profitable day.
     *
     * @param resultSet { DataTableResultSet }
     * @returns
     */
    static maxDailyRollup(resultSet) {

        return d3.nest()
            .key(function (d) {
                return d.ticker
            })
            .rollup(maxProfit)
            .entries(resultSet)
            .map(maxDailyRollupFormat);
    }

    /**
     * For each security, calculate which days were abnormally high (volume > avg_volume * performancePercentage)
     *
     * @param resultSet { DataTableResultSet<ticker,date,volume> }
     * @param performancePercentage { number } The percentage factor by which is considered 'unusual' if a security
     * performs above this mark
     */
    static busyDay(resultSet, performancePercentage = 1.10) {

        // Calculate the average volume for each security
        const avgVolume = d3.nest()
            .key(function (d) {
                return d.ticker
            })
            .rollup(function (d) {
                return {
                    average_volume: d3.mean(d, function (e) {
                        return e.volume;
                    })
                }
            })
            .object(resultSet);

        return resultSet.filter(function (value) {
            value.average_volume = avgVolume[value.ticker].average_volume;
            return value.volume > (value.average_volume * performancePercentage);
        });
    }

    /**
     * Which security had the biggest loss in a given ResultSet
     *
     * @param resultSet { DataTableResultSet }
     * @returns { { ticker: string, num_loser_days: number }} }
     */
    static biggestLoser(resultSet) {
        return d3.nest()
            .key(function (d) {
                return d.ticker
            })
            .rollup(function (d) {
                return {
                    ticker: d[0].ticker, // every element in this rollup will have same ticker
                    num_loser_days: d.filter(function (result) {
                        return result.close < result.open
                    }).length
                }
            })
            .entries(resultSet)
            .reduce(function (prev, current) {
                return (prev.value.num_loser_days > current.value.num_loser_days) ? prev : current
            }).value;
    }
}


/**
 * A helper function to format final d3 rollup result.
 *
 * @param d3ResultSet A key, value result set as determined by d3:v4
 * @returns {{ticker: string, monthly_stats: [{month: date, average_open: float, average_close: float}]}}
 */
function averageMonthlyRollupFormat(d3ResultSet) {

    const arr = [];
    d3ResultSet.values.forEach((d3Result) => {
        arr.push({
            month: d3Result.key,
            average_open: d3Result.value.average_open,
            average_close: d3Result.value.average_close
        })
    });

    return {ticker: d3ResultSet.key, monthly_stats: arr};
}

function maxDailyRollupFormat(d3ResultSet) {
    return {
        ticker: d3ResultSet.key,
        date: d3ResultSet.value.date,
        daily_max: d3ResultSet.value.daily_max
    };
}


/**
 * A function to iterate over a ResultSet and track which one had the highest difference between open and closing
 * prices.
 *
 * @param resultSet { DataTableResultSet }
 * @returns {{date: date, daily_max: number}}
 */
function maxProfit(resultSet) {

    if (Array.isArray(resultSet) && resultSet.length > 0) {

        let maxProfit = resultSet[0].close - resultSet[0].open;
        let maxProfitDate = resultSet[0].date;

        resultSet.forEach((result) => {
            if (result.close - result.open > maxProfit) {
                maxProfit = result.close - result.open;
                maxProfitDate = result.date;
            }
        });

        return {
            date: maxProfitDate,
            daily_max: maxProfit
        };
    }
}

/**
 * A helper function to parse the yyyy-mm from a standard yyyy-mm-dd date mask.
 *
 * @param dateString { string }
 * @returns { string }
 */
function parseMonth(dateString) {
    return dateString.substr(0, 7);
}

exports.PriceCalculator = PriceCalculator;

