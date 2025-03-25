var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active' and user_role = 'admin'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.Getcategory = async (category_name) => {
    var Query = `select * from bh_product_categories where category_name = ? and category_status ='active'`;
    var data = query(Query, [category_name]);
    return data;
};

module.exports.AddCategory = async (category_name, category_image) => {
    var Query = `insert into bh_product_categories(category_name,category_image)values(?,?)`;
    var data = query(Query, [category_name, category_image]);
    return data;
};

module.exports.AddCategoryLang = async (category_id, lang_id, category_name) => {
    var Query = `insert into bh_category_translation(ct_c_id,ct_language_id,ct_language_name)values(?,?,?)`;
    var data = query(Query, [category_id, lang_id, category_name]);
    return data;
};