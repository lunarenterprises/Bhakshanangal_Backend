var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.UpdatePaymentstatus = async (order_id, order_status) => {
    var Query = `update bh_order_details set order_Status=? where order_id=?`;
    var data = query(Query, [order_status, order_id]);
    return data;
};

module.exports.CheckUser = async (user_id) => {
    var Query = `select * from bh_user where user_id=? and user_role="admin"`
    return await query(Query, [user_id])
}