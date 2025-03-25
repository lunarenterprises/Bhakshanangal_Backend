var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (email) => {
  var Query = `select * from bh_user where user_email = ? and user_status = 'active'`;
  var data = await query(Query, [email]);
  return data;
};

module.exports.CheckVerificationQuery = async (user_id) => {
  var Query = `select * from bh_user_email_verification where user_email_verification_user_id = ?`;
  var data =await query(Query, [user_id]);
  return data;
};

module.exports.InsertVerificationQuery = async (user_id, token) => {
  var Query = `insert into bh_user_email_verification(user_email_verification_user_id,user_email_verification_token)values(?,?)`;
  var data =await query(Query, [user_id, token]);
  return data;
};

module.exports.UpdateVerificationQuery = async (user_id, token) => {
  var Query = `update bh_user_email_verification set user_email_verification_token = ? where user_email_verification_user_id = ?`;
  var data =await query(Query, [token, user_id]);
  return data;
};

module.exports.InsertUserQuery = async (name, email, password) => {
  var Query = `insert into bh_user(user_name,user_email,user_role,user_status,user_password)values(?,?,?,?,?)`;
  var data =await query(Query, [name, email, "user", "active", password]);
  return data;
};

module.exports.UpdateUserQuery = async (name, email, password) => {
  var Query = `update bh_user set user_name = ?,user_password = ? where user_email = ?`;
  var data =await query(Query, [name, password, email]);
  return data;
};
