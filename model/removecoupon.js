var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdmin = async (user_id) => {``
    var Query = `select * from bh_user where user_id = ? and user_role = 'admin'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.CheckCoupon = async (coupon_id) => {``
    var Query = `select * from bh_coupon where coupon_id = ? and coupon_status = 'active'` ;
    var data = query(Query, [coupon_id]);
    return data;
};

module.exports.RemoveCoupon = async (coupon_id) => {``
    var Query = `UPDATE bh_coupon
SET coupon_status = 'removed'
WHERE coupon_id = ?;`;
    var data = query(Query, [coupon_id]);
    return data;
};