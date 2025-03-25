var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.UserSelect = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active' `;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.productList = async (language, product) => {
    var Query = `select p.product_id,product_name,price,quantity,image_file from bh_products p
    inner join bh_product_translations t on t.product_id = p.product_id 
    inner join bh_order_product o on o.order_product_product_id = p.product_id 
    inner join bh_languages l on t.language_id = l.language_id 
    inner join bh_product_prices pr on pr.product_id = p.product_id
    left join bh_product_images i on i.product_id = p.product_id
    where l.language_code = ? and p.product_id = ?`;
    var data = query(Query, [language, product]);
    return data;
};

// module.exports.productListpaginated = async (language, condition, page, limit) => {
//     var Query = `select p.product_id,product_name,price,quantity,image_file,order_id,order_quantity,order_unit,order_status,gift_card from bh_order_details o
//     left join bh_products p on o.product_id = p.product_id
//     left join bh_product_translations t on t.product_id = p.product_id
//     left join bh_languages l on t.language_id = l.language_id 
//     left join bh_product_prices pr on pr.product_id = p.product_id
//     left join bh_product_images i on i.product_id = p.product_id
//     where l.language_code = ? ${condition} limit ${limit} offset ${page}`;
//     console.log(Query);
//     var data = query(Query, [language]);
//     return data;
// };

module.exports.Getorder = async () => {
    var Query = `select pd.payment_id,amount,provider,status,user_name,order_product_order_id as order_id,order_product_product_id as product_id ,order_product_quantity as order_quantity,order_product_unit as order_unit,order_status,order_payment_method,gift_card,delivery_mode_status from  bh_payment_details pd
    inner join bh_order_product p on p.order_product_order_id = pd.order_id 
    left join bh_order_details bo on  bo.order_id = p.order_product_order_id
    inner join bh_user u on bo.user_id = u.user_id
    left join bh_delivery_mode on  delivery_status = delivery_mode_id order by order_id desc;`
    console.log(Query);
    var data = await query(Query)
    return data
}

module.exports.Getorderpaginated = async (page, limit) => {
    var Query = `select pd.payment_id,amount,provider,status,user_name,order_product_order_id as order_id,order_product_product_id as product_id ,order_product_quantity as order_quantity,order_product_unit as order_unit,order_status,order_payment_method,gift_card,delivery_mode_status from  bh_payment_details pd
    inner join bh_order_product p on p.order_product_order_id = pd.order_id 
    left join bh_order_details bo on  bo.order_id = p.order_product_order_id
    inner join bh_user u on bo.user_id = u.user_id
    left join bh_delivery_mode on  delivery_status = delivery_mode_id order by order_id desc limit ${limit} offset ${page}`
    var data = await query(Query)
    return data
}