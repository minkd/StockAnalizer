const should = require('chai').should();
const log = require('../../../src/lib/Logger');


describe('Logger Test Suite', function () {
    it('Should log a message', function () {
        log.stream.write("test-log");
        log.should.have.property('level')
    });
});
