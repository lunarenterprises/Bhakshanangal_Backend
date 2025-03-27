var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.DeleteCategory = async (category_id) => {
    var Query = `Delete from bh_product_categories where category_id = ?`;
    var data = query(Query, [category_id]);
    return data;
};

module.exports.CheckUser = async (user_id) => {
    var Query = `select * from bh_user where user_id=? and user_role="admin"`
    return await query(Query, [user_id])
}