var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
};


module.exports.GetCategory = async (lang) => {
    var Query = `SELECT category_id,ct_language_name as category_name,category_image,category_status FROM bh_category_translation
inner join bh_product_categories on ct_c_id = category_id
inner join bh_languages on ct_language_id = language_id
where category_status = 'active' and language_code = ?`;
    var data = query(Query,[lang]);
    return data;
};

module.exports.GetProductCategoryCount = async (category_id) => {
    var Query = `select * from bh_products where category_id = ?`;
    var data = query(Query, [category_id]);
    return data;
};

