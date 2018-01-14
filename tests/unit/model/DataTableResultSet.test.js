const should = require('chai').should();

const { DataTableResultSet } = require('../../../src/server/model/DataTableResultSet');

describe('ResultSet Test Suite', function () {

    const dataTable = require('../factory/data/data_table');

    it('Should validate a Quandl table result is converted to a usable JSON object keyed by name.', function () {
        const resultSetRef = new DataTableResultSet((dataTable));
        const resultSet = resultSetRef.get(['ticker', 'date', 'open', 'close', 'volume']);

        resultSet.should.be.an('array');

        resultSet[0].should.eql({
            ticker: 'TEST',
            date: '1970-01-01',
            open: 100,
            close: 200,
            volume: 50
        });
    });
});
