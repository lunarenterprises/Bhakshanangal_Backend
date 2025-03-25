var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (user_id) => {
  var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
  var data = query(Query, [user_id]);
  return data;
};

module.exports.CheckCoupon = async (coupon_code, current_date) => {
  var Query = `select * from bh_coupon where lower(coupon_code) = ? and valid_from <= ? and valid_to >= ? and coupon_status = 'active'`;
  var data = query(Query, [
    coupon_code.toLowerCase(),
    current_date,
    current_date,
  ]);
  return data;
};
