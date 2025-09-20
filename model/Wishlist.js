var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUser = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
};
module.exports.CheckProduct = async (product_id) => {
    var Query = `select * from bh_products where product_id = ?`;
    var data = query(Query, [product_id]);
    return data;
};

module.exports.AddWish = async (product_id, user_id) => {
    var Query = `INSERT INTO bh_wishlist (wish_product_id, wish_user_id)
    VALUES (?,?) `;
    var data = query(Query, [product_id, user_id]);
    return data;
};

module.exports.CheckWish = async (product_id, user_id) => {
    var Query = `select * from bh_wishlist where wish_product_id = ? and wish_user_id = ?`;
    var data = query(Query, [product_id, user_id]);
    return data;
};

module.exports.RemoveWish = async (product_id, user_id) => {
    var Query = `DELETE FROM bh_wishlist where wish_product_id = ? and wish_user_id`;
    var data = query(Query, [product_id, user_id]);
    return data;
};