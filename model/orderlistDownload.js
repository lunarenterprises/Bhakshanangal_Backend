var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.UserSelect = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
};




module.exports.Getorder = async (condition) => {
    var Query = `SELECT 
    od.*, 
    op.*, 
    u.user_name, 
    pd.*, 
    a.*, 
    p.*
FROM bh_order_details od
LEFT JOIN bh_order_product op ON od.order_id = op.order_product_order_id
INNER JOIN bh_user u ON od.user_id = u.user_id
LEFT JOIN bh_payment_details pd ON od.order_id = pd.order_id
INNER JOIN bh_product_translations p ON op.order_product_product_id = p.product_id
LEFT JOIN bh_address a ON od.address_id = a.address_id where p.language_id = 0 ${condition} ORDER BY op.order_product_order_id DESC`
    var data = await query(Query)
    return data
}

module.exports.getPayment = async (order_id) => {
    var Query = `SELECT * FROM bh_payment_details where order_id = ?`
    var data = await query(Query, [order_id])
    return data
}
