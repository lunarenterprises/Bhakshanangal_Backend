var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUser = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status ='active'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.CheckList = async (user_id, page, limit) => {
    var Query = `select order_product_order_id as order_id,order_product_product_id as product_id ,order_quantity,order_unit,created_at,modified_at,order_status,order_payment_method,gift_card,delivery_mode_status from  bh_order_product
    left join bh_order_details bo on  order_product_order_id  = order_id
    inner join bh_user u on bo.user_id = u.user_id and u.user_id = ?
    left join bh_delivery_mode on  delivery_status = delivery_mode_id where order_status = 'returned' order by order_id desc limit ${limit} offset ${page}`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.productdata = async (lang, product_id) => {
    var Query = `select product_name,price,quantity,product_unit,image_file,p.product_rating,p.product_rating_count from bh_products p
    inner join bh_product_translations t on t.product_id = p.product_id
    inner join bh_languages l on t.language_id = l.language_id 
    inner join bh_product_prices pr on pr.product_id = p.product_id
    left join bh_product_images i on i.product_id = p.product_id
    where l.language_code = ? and p.product_status = 'active' and p.product_id = ?`;
    var data = query(Query, [lang, product_id]);
    return data;
};