var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.UpdateDeliveryStatus = async (order_id, delivery_status, delivery_date) => {
    var Query = `update  bh_order_details set delivery_status=?, delivery_date=? where order_id=?`;
    var data = query(Query, [delivery_status, delivery_date, order_id]);
    return data;
};

module.exports.CheckUser = async (user_id) => {
    var Query = `select * from bh_user where user_id=? and user_role="admin"`
    return await query(Query, [user_id])
}