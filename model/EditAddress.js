var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (user_id) => {
  var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
  var data = query(Query, [user_id]);
  return data;
};

module.exports.UpdateAddressQuery = async (
  full_name,
  phone_number,
  alt_phone_number,
  pincode,
  state,
  city,
  building_name,
  area_name,
  landmark,
  user_id,
  address_id
) => {
  let alt_ph = "";
  let alt_phs = "";
  if (alt_phone_number !== "" && alt_phone_number !== undefined) {
    alt_ph = `,address_alt_phone_number`;
    alt_phs = `='${alt_phone_number}'`;
  }
  var Query = `update bh_address set address_fullname= ?,address_phone_number=?,address_pincode=?,address_state=?,address_city=?,address_building_name=?,address_area_name=?,address_landmark=?,address_status=?,address_user_id=?${alt_ph}${alt_phs} where address_id = ?`;
  var data = query(Query, [
    full_name,
    phone_number,
    pincode,
    state,
    city,
    building_name,
    area_name,
    landmark,
    "active",
    user_id,
    address_id,
  ]);
  return data;
};
