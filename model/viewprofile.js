var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (user_id) => {
    var Query = `select user_id,user_name,user_last_name,user_email,user_mobile,address_id,address_pincode,address_state,address_city,address_building_name,address_area_name,address_landmark,address_phone_number,address_alt_phone_number from bh_user u
    left join bh_address a on  a.address_id =u.user_address
     where u.user_id = ? and u.user_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
};