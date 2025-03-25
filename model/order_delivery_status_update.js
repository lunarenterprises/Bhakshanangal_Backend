var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active' and user_role = 'admin'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.updatedeliverystatusQuery = async (delivery_status, order_id) => {
    var Query = `update bh_order_details set delivery_status = ? where order_id = ?`;
    var data = await query(Query, [delivery_status, order_id]);
    return data;
};

module.exports.getdeliverymode = async (delivery_status) => {
    var Query = `select delivery_mode_status from bh_delivery_mode where delivery_mode_id = ? `;
    var data = query(Query, [delivery_status]);
    return data;
};

module.exports.getOrder = async (lang,order_id) => {
    var Query = `select order_product_product_id,product_name from bh_order_product p
    inner join bh_product_translations t on t.product_id = p.order_product_product_id
    inner join bh_languages l on t.language_id = l.language_id 
    inner join bh_product_prices pr on pr.product_id = p.order_product_product_id
    left join bh_product_images i on i.product_id = p.order_product_product_id
    where l.language_code = ? and p.order_product_order_id = ? `;
    var data = query(Query, [lang,order_id]);
    return data;
};