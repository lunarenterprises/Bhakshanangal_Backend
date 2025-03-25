var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.productList = async (language, order_id) => {
    var Query = `select p.product_id,product_name,price,quantity,image_file,order_id,order_product_quantity as order_quantity,order_product_unit as order_unit,gift_card,order_status,delivery_mode_status,address_id from bh_order_details o
	inner join bh_order_product opp on opp.order_product_order_id =  o.order_id
    inner join bh_delivery_mode dv on o.delivery_status = dv.delivery_mode_id 
    inner join bh_products p on opp.order_product_product_id = p.product_id
    inner join bh_product_translations t on t.product_id = p.product_id
    inner join bh_languages l on t.language_id = l.language_id 
    inner join bh_product_prices pr on pr.product_id = p.product_id
    left join bh_product_images i on i.product_id = p.product_id
    where l.language_code =? and order_id = ?`;
    var data = query(Query, [language, order_id]);
    return data;
};

module.exports.checkAddress = async (address_id) => {
    var Query = `select * from bh_address where address_id = ?`
    var data = query(Query, [address_id]);
    return data;
}