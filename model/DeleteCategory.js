const { error } = require("console");
var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.DeleteCategory = async (category_id) => {
    try {
        let productQuery = `DELETE FROM bh_products WHERE category_id = ? AND product_status = 'removed'`;
        let productData = await query(productQuery, [category_id]);

        if (productData.affectedRows > 0) {
            let categoryQuery = `DELETE FROM bh_product_categories WHERE category_id = ?`;
            let categoryData = await query(categoryQuery, [category_id]);
            return categoryData;
        } else {
            throw new Error("No products with status 'removed' found in this category.");
        }
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};

module.exports.CheckUser = async (user_id) => {
    var Query = `select * from bh_user where user_id=? and user_role="admin"`
    return await query(Query, [user_id])
}