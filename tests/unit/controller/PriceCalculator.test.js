const should = require('chai').should();

const {PriceCalculator} = require('../../../src/server/controller/PriceCalculator');
const {DataTableResultSet} = require('../../../src/server/model/DataTableResultSet');

describe('PriceCalculator Test Suite', function () {

    const dataTable = require('../factory/data/data_table');

    it('Should show average monthly open and close prices', function () {
        const averageMonthlyRollup = PriceCalculator.averageMonthlyRollup(new DataTableResultSet((dataTable)).get());

        averageMonthlyRollup.should.be.an('array');
        averageMonthlyRollup[0].should.have.property("ticker");
        averageMonthlyRollup[0]["ticker"].should.eql("TEST");
        averageMonthlyRollup[0].should.eql({
            ticker: 'TEST',
            monthly_stats:
                [
                    {month: '1970-01', average_open: 75, average_close: 105},
                    {month: '1970-03', average_open: 30, average_close: 90}
                ]
        });

    });

    it('Should show max profit given an array of values', function () {
        const maxProfit = PriceCalculator.maxDailyRollup(new DataTableResultSet((dataTable)).get());
        maxProfit.should.be.an('array');
        maxProfit[0].should.eql({ ticker: 'TEST', date: '1970-01-01', daily_max: 100 });
    });

    it('Should show the busiest day for each security', function () {

        const busyDay = PriceCalculator.busyDay(new DataTableResultSet((dataTable)).get());
        busyDay.should.be.an('array');
        busyDay.length.should.be.above(1);

        busyDay[0].should.eql(
            {
                ticker: 'TEST',
                date: '1970-03-01',
                open: 30,
                close: 90,
                volume: 150,
                average_volume: 100
            });

    });

    it('Should show the biggest loosing security', function () {
        const biggestLoser = PriceCalculator.biggestLoser(new DataTableResultSet((dataTable)).get());

        biggestLoser.should.eql({
            ticker: 'TEST3',
            num_loser_days: 1
        });
    });


});
