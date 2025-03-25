var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active' and user_role = 'admin'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.Getuserlist = async () => {
    var Query = `select * from bh_user where user_role !='admin'`;
    var data = query(Query);
    return data;
};

module.exports.GetProducts = async (language, current_date) => {
    var Query = `select p.product_id,product_name,price,quantity,image_file from bh_products p
    inner join bh_product_translations t on t.product_id = p.product_id
    inner join bh_languages l on t.language_id = l.language_id 
    inner join bh_product_prices pr on pr.product_id = p.product_id
    left join bh_product_images i on i.product_id = p.product_id
    where l.language_code = ? and YEAR(p.created_at) = YEAR(?) AND MONTH(p.created_at) = MONTH(?)`;
    var data = query(Query, [language, current_date, current_date]);
    return data;
};

module.exports.Orderlist = async (language, current_date) => {
    var Query = `select p.product_id,product_name,price,quantity,image_file,order_id,order_product_quantity as order_quantity,order_product_unit as order_unit,gift_card,order_status from bh_order_details o
    inner join bh_order_product op on order_id = order_product_order_id
    inner join bh_products p on op.order_product_product_id	 = p.product_id
    inner join bh_product_translations t on t.product_id = p.product_id
    inner join bh_languages l on t.language_id = l.language_id 
    inner join bh_product_prices pr on pr.product_id = p.product_id
    left join bh_product_images i on i.product_id = p.product_id
    where l.language_code = ? and YEAR(o.created_at) = YEAR(?) AND MONTH(o.created_at) = MONTH(?)`;
    var data = query(Query, [language, current_date, current_date]);
    return data;
};


module.exports.SellingTop = async (language, current_date) => {
    var Query = `SELECT op.order_product_product_id as product_id,t.product_name,i.image_file
    FROM bh_order_details o
     inner join bh_order_product op on order_id = order_product_order_id
    inner join bh_product_translations t on t.product_id = op.order_product_product_id
    inner join bh_languages l on t.language_id = l.language_id 
    left join bh_product_images i on i.product_id = op.order_product_product_id
    where l.language_code = ? and YEAR(created_at) = YEAR(?) AND MONTH(created_at) = MONTH(?)
    GROUP BY op.order_product_product_id,t.product_name
    ORDER BY COUNT(*) DESC
    LIMIT 5;`;
    var data = query(Query, [language, current_date, current_date]);
    return data;
};