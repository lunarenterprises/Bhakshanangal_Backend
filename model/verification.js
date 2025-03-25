var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (email) => {
  var Query = `select * from bh_user where user_email = ? and user_status = 'active'`;
  var data = await query(Query, [email]);
  return data;
};

module.exports.CheckVerificationQuery = async (user_id, code) => {
  var Query = `select * from bh_user_email_verification where user_email_verification_user_id = ? and user_email_verification_token = ?`;
  var data =await query(Query, [user_id, code]);
  return data;
};

module.exports.UpdateUserinfoQuery = async (user_id, date) => {
  var Query = `update bh_user set user_joining_date = ?,user_email_verification = ? where user_id = ?`;
  var data =await query(Query, [date,'yes',user_id]);
  return data;
};