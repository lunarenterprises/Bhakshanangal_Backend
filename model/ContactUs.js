var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.InsertContactus = async (name, email, message) => {
    var Query = `insert into bh_contact_us (
    name,
    email,
    message
    )values(?,?,?)`;
    var data = query(Query, [name, email, message]);
    return data;
};

module.exports.CheckUserQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
};