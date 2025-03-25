var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async(user_id) =>{
    var Query = `select * from bh_user where user_id = ? and user_role = 'admin'`;
  var data = query(Query, [user_id]);
  return data;
}

module.exports.AddCouponQuery = async(coupon_code,ValidFrom,ValidTo) =>{
  var Query =`INSERT INTO bh_coupon (coupon_code, valid_from, valid_to, coupon_status) VALUES ('${coupon_code}', '${ValidFrom}','${ValidTo}') ;`;
  var data = query(Query, [coupon_code,ValidFrom,ValidTo,'active']);
  return data;
}