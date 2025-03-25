var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
  };

  module.exports.setAddress = async (address_id,user_id) =>{
    var Query = `UPDATE bh_user SET user_address = ${address_id} WHERE user_id = ${user_id}`
    var data = query(Query);
    return data;
  };
  module.exports.getAddress = async (address_id) =>{
    var Query = `select * from bh_address where address_id = ${address_id}`
    var data = query(Query);
    return data;
  };