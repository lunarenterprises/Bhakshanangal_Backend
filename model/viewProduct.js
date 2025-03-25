var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.GetProducts = async (language,product_id) => {
    var Query = `select distinct p.product_id,product_name,p.product_unit,t.description,product_status,price,quantity,category_name,quantity,shipping,cash_on_delivery,refundable,free_delivery,product_rating,stock_stock from bh_products p
    inner join bh_product_translations t on t.product_id = p.product_id
    inner join bh_languages l on t.language_id = l.language_id 
    inner join bh_product_prices pr on pr.product_id = p.product_id
    inner join bh_product_categories ca on ca.category_id = p.category_id
    left join bh_product_images i on i.product_id = p.product_id
    inner join bh_product_stock ps on ps.product_id = p.product_id
    where l.language_code = ? and p.product_id in (?)`;
    var data = query(Query,[language,product_id]);
    return data;
};

module.exports.Getwishlist = async (user_id,product_id) => {
    var Query = `select * from bh_wishlist where wish_user_id = ? and wish_product_id = ?`
    var data = query(Query,[user_id,product_id]);
    return data;
}

module.exports.GetImages = async (product_id) => {
    var Query = `SELECT * from bh_product_images
 where product_id = ?`
    var data = query(Query, [product_id]);
    return data;
}

module.exports.GetImagess = async (product_id) => {
    var Query = `SELECT * from bh_product_images
 where product_id = ? and image_priority =0`
    var data = query(Query, [product_id]);
    return data;
}
