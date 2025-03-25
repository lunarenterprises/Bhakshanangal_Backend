var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
};
module.exports.UpdateUserQuery = async(user_id,condition) => {
    var Query =`update bh_user ${condition} where user_id = ?`
    var data = query(Query,[user_id]);
    return data;
}
module.exports.UpdateAddressQuery = async(address_id,conditions) => {
    var Query =`update bh_address ${conditions} where address_id = ?`
    var data = query(Query,[address_id]);
    return data;
}

module.exports.ChangepasswordQuery = async (user_id, password) => {
    var Query = `update bh_user set user_password = ? where user_id = ?`;
    var data = query(Query, [password, user_id]);
    return data;
  };