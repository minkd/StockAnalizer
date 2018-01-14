const should = require('chai').should();
const config = require('../../../src/config');
const Quandl = require('../../../src/services/Quandl');

let quandl, fields;
before(function () {
    quandl = new Quandl(config.api_endpoint, config.auth_token, config.api_version);
    fields = ['ticker', 'date', 'open', 'close', 'volume'];
});

describe('Quandle Integration Test Suite', function () {

    // give tests 20 seconds to complete
    this.timeout(9000);

    const options = {"ticker[]": ["GOOGL"], "date.gte": "2018-01-11", "date.lte": "2018-01-11"};

    it('Should get a valid response from Quandl', function (done) {
        quandl.query("datatables", "WIKI", "PRICES", options)
            .then(function (res) {
                res.should.have.property("datatable");
                done();
            })
            .catch(function (error) {
                should.not.exist(error);
                done();
            });
    });

    it('Should return small datatable query, no recursion should occur', function (done) {
        quandl.getDataTable("WIKI", "PRICES", options, fields)
            .then(function (res) {
                res.should.be.an('array');
                res[0].should.have.property('ticker');
                res[0].ticker.should.equal('GOOGL');
                done();
            })
            .catch(function (error) {
                should.not.exist(error);
                done();
            })
    });

    it('Should return large datatable query, recursive queries should occur', function (done) {

        // Add a range to dates
        options["date.gte"] = "2017-12-01";
        options["date.lte"] = "2017-12-31";

        // Only return 10 at a time so we can verify a recursive call is made to retrieve second page
        options["qopts.per_page"] = 10;

        // There are 20 weekdays of trading in above date range
        const numWeekDaysInRange = 20;

        quandl.getDataTable("WIKI", "PRICES", options, fields)
            .then(function (res) {
                res.should.be.an('array');
                res.length.should.be.eq(numWeekDaysInRange);
                res[0].should.have.property('ticker');
                res[0].ticker.should.equal('GOOGL');
                done();
            })
            .catch(function (error) {
                should.not.exist(error);
                done();
            });

    });
});

