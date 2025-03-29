var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.DeleteCategory = async (category_id) => {
    try {
        let categoryItems = `select * from bh_products where category_id=?`
        let products = await query(categoryItems, [category_id])
        if (products.length > 0) {
            let productQuery = `DELETE FROM bh_products WHERE category_id = ? AND product_status = 'removed'`;
            let productData = await query(productQuery, [category_id]);
            if (productData.affectedRows === 0) {
                throw new Error("Failed to remove category")
            }
        }
        let categoryQuery = `DELETE FROM bh_product_categories WHERE category_id = ?`;
        return await query(categoryQuery, [category_id]);
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};

module.exports.CheckUser = async (user_id) => {
    var Query = `select * from bh_user where user_id=? and user_role="admin"`
    return await query(Query, [user_id])
}