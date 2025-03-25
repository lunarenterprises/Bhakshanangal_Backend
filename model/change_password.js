var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (email) => {
  var Query = `select * from bh_user where user_email = ? and user_status = 'active'`;
  var data = query(Query, [email]);
  return data;
};

module.exports.ChangepasswordQuery = async (user_id, password) => {
  var Query = `update bh_user set user_password = ? where user_id = ?`;
  var data = query(Query, [password, user_id]);
  return data;
};
