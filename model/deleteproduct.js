var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async(user_id)=>{
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query,[user_id]);
    return data;
};

module.exports.CheckProduct = async(product_id)=>{
    var Query = `select * from bh_products where product_id = ? and product_status = 'active'`;
    var data = query(Query,[product_id]);
    return data;
};

module.exports.DeleteProduct = async(product_id)=>{
    var Query = `UPDATE bh_products
    SET product_status = 'removed'
    WHERE product_id = ?`;
    var data = query(Query,[product_id]);
    return data;
};
