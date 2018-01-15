const should = require('chai').should();


const Quandl = require('../../../src/services/Quandl');

let client;
before(() => {
    client = new Quandl();
});


describe('ResultSet', function () {


    it('Should throw error for invalid type', function () {
            client.query("invalid", "WIKI", "PRICES", {})
                .then(function(result){
                    result.should.be.an('undefined');
                })
                .catch(function(error){
                    error.should.have.property('error')
                })
    });

    it('Should throw error for invalid format', function () {
        client.query("datatables", "WIKI", "PRICES", {}, "JSON-Invalid")
            .then(function(result){
                result.should.be.an('undefined');
            })
            .catch(function(error){
                error.should.have.property('error')
            })
    });

});
