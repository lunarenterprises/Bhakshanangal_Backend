var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUser = async(user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query,[user_id]);
    return data;
};
module.exports.CheckOrder = async(order_id,user_id) => {
    var Query = `select * from bh_order_details where order_id = ? and order_status = 'confirmed' and user_id = ?`;
    var data = query(Query,[order_id,user_id]);
    return data;
};

module.exports.RemoveOrder = async(order_id) => {
    var Query = `UPDATE bh_order_details
    SET order_status = 'cancelled'
    WHERE order_id = ?;`;
    var data = query(Query,[order_id]);
    return data;
};