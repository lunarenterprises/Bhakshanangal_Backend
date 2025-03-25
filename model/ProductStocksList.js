var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUser = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status ='active'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.GetProducts = async (language, condition, limit, page_no) => {
    var Query = `select p.product_id,product_name,image_file,ps.stock_stock as product_stock,stock_status from bh_products p
    inner join bh_product_translations t on t.product_id = p.product_id
    inner join bh_languages l on t.language_id = l.language_id 
    inner join bh_product_prices pr on pr.product_id = p.product_id
    left join bh_product_images i on i.product_id = p.product_id
    inner join bh_product_stock ps on ps.product_id = p.product_id
    where l.language_code = ? and p.product_status = 'active'  ${condition} order by p.product_id desc limit ? offset ? `;
    // console.log(Query, "Query");
    var data = query(Query, [language, limit, page_no]);
    return data;
};

module.exports.ProductTotalCount = async (language, condition) => {
    var Query = `select p.product_id,product_name,image_file,ps.stock_stock as product_stock,stock_status from bh_products p
    inner join bh_product_translations t on t.product_id = p.product_id
    inner join bh_languages l on t.language_id = l.language_id 
    inner join bh_product_prices pr on pr.product_id = p.product_id
    left join bh_product_images i on i.product_id = p.product_id
    inner join bh_product_stock ps on ps.product_id = p.product_id
    where l.language_code = ? and p.product_status = 'active'  ${condition}`;
    // console.log(Query, "Query");
    var data = query(Query, [language]);
    return data;
};