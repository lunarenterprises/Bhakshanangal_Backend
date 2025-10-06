var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

// 1️⃣ Check if category exists
module.exports.CheckCategoryExists = async (category_id) => {
  const sql = `SELECT * FROM bh_product_categories WHERE category_id = ?`;
  return await query(sql, [category_id]);
};

// 2️⃣ Check if subcategories exist under this category
module.exports.CheckSubCategories = async (category_id) => {
  const sql = `SELECT * FROM bh_product_sub_categories WHERE sc_category_id = ?`;
  return await query(sql, [category_id]);
};

// 3️⃣ Check if products exist under this category
module.exports.CheckProducts = async (category_id) => {
  const sql = `SELECT * FROM bh_products WHERE category_id = ?`;
  return await query(sql, [category_id]);
};

// 4️⃣ Delete category translations
module.exports.DeleteCategoryTranslations = async (category_id) => {
  const sql = `DELETE FROM bh_category_translation WHERE ct_c_id = ?`;
  return await query(sql, [category_id]);
};

// 5️⃣ Delete category row
module.exports.DeleteCategoryRow = async (category_id) => {
  const sql = `DELETE FROM bh_product_categories WHERE category_id = ?`;
  return await query(sql, [category_id]);
};


// 1️⃣ Get Subcategory by ID
module.exports.GetSubcategoryById = async (subcategory_id) => {
  const sql = `SELECT * FROM bh_product_sub_categories WHERE sc_id = ?`;
  return await query(sql, [subcategory_id]);
};

// 2️⃣ Check Products linked to this Subcategory
module.exports.CheckProductsBySubCategory = async (subcategory_id) => {
  const sql = `SELECT * FROM bh_products WHERE sub_category_id = ?`;
  return await query(sql, [subcategory_id]);
};

// 3️⃣ Delete Subcategory Translations
module.exports.DeleteSubCategoryTranslations = async (subcategory_id) => {
  const sql = `DELETE FROM bh_subcategory_translation WHERE sct_c_id = ?`;
  return await query(sql, [subcategory_id]);
};

// 4️⃣ Delete Subcategory Row
module.exports.DeleteSubCategoryRow = async (subcategory_id) => {
  const sql = `DELETE FROM bh_product_sub_categories WHERE sc_id = ?`;
  return await query(sql, [subcategory_id]);
};
