var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
}

module.exports.GetAddress = async (address_id) => {
    var Query = `select * from bh_address where address_id = ?`;
    var data = query(Query, [address_id]);
    return data;
}

module.exports.getproduct = async (product_id) => {
    var Query = `SELECT * FROM bh_products AS p
INNER JOIN bh_product_translations AS pt 
    ON p.product_id = pt.product_id
INNER JOIN bh_product_prices AS pp
    ON p.product_id = pp.product_id
WHERE p.product_id = ? 
    AND pt.language_id = 0 `;
    var data = query(Query, [product_id]);
    return data;
}

module.exports.AddOrderQuery = async (user_id, amount, date, gift_card, payment_method, delivery_date, address_id) => {
    let col = ``
    let val = ``
    if (payment_method == 'cod') {
        col = `,order_status`
        val = `confirmed`
    } else {
        col = `,order_status`
        val = `pending`
    }
    var Query = `insert into bh_order_details (user_id,order_amount,created_at,order_status,order_payment_method,gift_card,delivery_date,address_id) values(?,?,?,?,?,?,?,?)`;
    var data = await query(Query, [user_id, amount, date, val, payment_method, gift_card, delivery_date, address_id]);
    return data;
}

module.exports.ProductInsert = async (order_id, el) => {
    var Query = `insert into bh_order_product(order_product_order_id,order_product_product_id,order_product_quantity,order_product_unit)values(?,?,?,?)`
    var data = await query(Query, [order_id, el.product_id, el.order_quantity, el.order_unit]);
    return data;
}

module.exports.cart_remove = async (user_id, el) => {
    var Query = `update bh_cart set status = 'inactive' where user_id = ? and product_id = ?`
    var data = await query(Query, [user_id, el.product_id]);
    return data
}
module.exports.PaymentInsert = async (order_id, user_id, amount, date, payment_method) => {
    var Query = `insert into bh_payment_details(order_id,user_id,amount,provider,status,created_at,payment_method)values(?,?,?,?,?,?,?)`
    var data = await query(Query, [order_id, user_id, amount, 'unknown', 'pending', date, payment_method]);
    return data;
}