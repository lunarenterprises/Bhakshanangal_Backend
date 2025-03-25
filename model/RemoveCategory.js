var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active' and user_role = 'admin'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.Getcategory = async (category_id) => {
    var Query = `select * from bh_product_categories where category_id = ?`;
    var data = query(Query, [category_id]);
    return data;
};

module.exports.RemoveCategory = async (category_id) => {
    var Query = `delete from bh_product_categories where category_id = ?`;
    var data = query(Query, [category_id]);
    return data;
};