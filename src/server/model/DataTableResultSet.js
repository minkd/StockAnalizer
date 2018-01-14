
/**
 * The DataTableResultSet class translates a Quandl data sets to a normalized JSON Object which can be keyed by name.
 *
 * @class DataTableResultSet
 */
class DataTableResultSet {
    constructor(rawQuandlTableResults) {
        this.init(rawQuandlTableResults);
    }

    init(object) {

        this.get = (fields) => {
            const table = object.datatable;
            const cols = table.columns;
            const rows = table.data;

            let arr = [];
            for (let i = 0; i < rows.length; i++) {
                let obj = {};
                for (let j = 0; j < cols.length; j++) {
                    if (Array.isArray(fields)){
                        if (fields.includes(cols[j].name)){
                            obj[cols[j].name] = rows[i][j];
                        }
                    } else {
                        obj[cols[j].name] = rows[i][j];
                    }
                }
                arr.push(obj)
            }

            return arr;
        };

        return object
    }
}

/**
 * @type {DataTableResultSet}
 */
exports.DataTableResultSet = DataTableResultSet;