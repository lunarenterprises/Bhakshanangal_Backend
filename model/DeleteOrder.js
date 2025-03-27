var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);


module.exports.DeleteOrder = async (order_id) => {
    var Query = `delete from bh_order_product
    WHERE order_product_order_id = ?`;
    var data = query(Query, [order_id]);
    return data;
};

module.exports.CheckUserQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
};
