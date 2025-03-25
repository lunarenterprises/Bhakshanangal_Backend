var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (email) => {
    var Query = `select * from bh_user where user_email = ? and user_status = 'active'`;
    var data = await query(Query, [email]);
    return data;
};

module.exports.InsertUserQuery = async (name, email) => {
    var Query = `insert into bh_user(user_name,user_email,user_role,user_status,user_email_verification)values(?,?,?,?,?)`;
    var data = await query(Query, [name, email, "user", "active","yes"]);
    return data;
};
