var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (user_id) => {
  var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
  var data = query(Query, [user_id]);
  return data;
};

module.exports.CheckAddressQuery = async (user_id, address_id, page_no, limit) => {
  if (address_id !== "" && address_id !== undefined) {
    var Query = `select * from bh_address where address_user_id = ? and address_id = '${address_id}' and address_status = 'active' limit ? offset ?`;
  } else {
    var Query = `select * from bh_address where address_user_id = ? and address_status = 'active' ORDER BY address_id DESC limit ? offset ?`;
  }
  var data = query(Query, [user_id, limit, page_no]);
  return data;
};

module.exports.CheckAddressQuery1 = async (user_id, address_id) => {
  if (address_id !== "" && address_id !== undefined) {
    var Query = `select * from bh_address where address_user_id = ? and address_id = '${address_id}' and address_status = 'active' `;
  } else {
    var Query = `select * from bh_address where address_user_id = ? and address_status = 'active'`;
  }
  var data = query(Query, [user_id]);
  return data;
};