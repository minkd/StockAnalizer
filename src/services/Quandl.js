'use strict';
const logger = require('../lib/Logger');
const async = require('async');
const request = require("request-promise");
const {DataTableResultSet} = require('../server/model/DataTableResultSet');

const ALLOWABLE_TYPES = ['datatables', 'dataset'];
const ALLOWABLE_FORMATS = ['JSON', 'XML', 'CSV'];

class Quandl {

    constructor(endpoint, auth_token, api_version) {
        this.api_endpoint = endpoint;
        this.auth_token = auth_token;
        this.api_version = api_version;
    }

    /**
     * A wrapper around the base query to ensure additional cursor_ids are followed.
     *
     * @param dataCode { string } datatable_code or database_code (depending on @type)
     * @param dataSetName { string } subset only valid for database_code
     * @param options { Object } A JSON object with any requested query parameters
     * @param fields { Array } An array of requested fields to parse
     */
    getDataTable(dataCode, dataSetName, options, fields) {

        const opts = Object.assign({}, options);

        const that = this;
        return new Promise(function (resolve, reject) {

            let currResult;
            async.until(
                function () {
                    if (!currResult){
                        return false;
                    } else {
                        return !(currResult && currResult.meta && currResult.meta.next_cursor_id)
                    }
                },

                function (cb) {
                    that.query(ALLOWABLE_TYPES[0], dataCode, dataSetName, opts)
                        .then(function (res) {
                            if (res && res.meta) {
                                if (!currResult) {
                                    currResult = res;
                                } else {
                                    currResult.datatable.data.push(...res.datatable.data);
                                    currResult.meta.next_cursor_id = res.meta.next_cursor_id;
                                }

                                Object.assign(opts, {"qopts.cursor_id": currResult.meta.next_cursor_id})
                            }
                        })
                        .then(cb)
                },

                function(){
                    resolve(new DataTableResultSet(currResult).get(fields))
                }
            );

        })
    }

    /**
     * A function to query Quandle for appropriate data. For more information
     * see ('https://docs.quandl.com/v1.0/docs/in-depth-usage')
     *
     * @param dataType { string } One of 'datatable' or 'dataset'
     * @param dataCode { string } datatable_code or database_code (depending on @type)
     * @param dataSetName { string } subset only valid for database_code
     * @param options { Object } A JSON object with any requested query parameters
     * @param dataSetFormat {string} One of JSON, XML, CSV, defaults to JSON
     */
    query(dataType, dataCode, dataSetName, options, dataSetFormat = "JSON") {

        // Check for valid data request type
        if (ALLOWABLE_TYPES.indexOf(dataType) < 0) {
            return Promise.reject({ error: 'Must be of type: ' + ALLOWABLE_TYPES })
        }

        // Check for valid format type
        if (ALLOWABLE_FORMATS.indexOf(dataSetFormat) < 0) {
            return Promise.reject({ error: 'Must be of format type: ' + ALLOWABLE_FORMATS })
        } else {
            dataSetFormat = dataSetFormat.toLowerCase();
        }

        const nameAndFormat = [dataSetName, dataSetFormat].join('.');

        const urlParts = [this.api_endpoint, this.api_version, dataType, dataCode, nameAndFormat];

        const req = {
            url: urlParts.join("/"),
            qs: Object.assign({api_key: this.auth_token}, options),
            json: true,
            useQuerystring: true
        };

        logger.debug(req);
        return request(req)
    }
}

module.exports = Quandl;
