var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.ListContactus = async () => {
    var Query = `select * from bh_contact_us`
    return await query(Query)
}