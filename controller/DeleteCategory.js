var model = require("../model/DeleteCategory");
var { languages } = require("../languages/languageFunc");

module.exports.DeleteCategory = async (req, res) => {
    try {
        const lang = req.body.language || 'en';
        const language = await languages(lang);
        const { category_id } = req.body;

        // 1️⃣ Validate input
        if (!category_id) {
            return res.send({ result: false, message: "Category id is required" });
        }

        // 2️⃣ Check user role
        const { role } = req.user || {}
        if (role !== "admin" || !role) {
            return res.send({
                result: false,
                message: language?.Try_with_admin_level_Account || "Admin privileges required"
            });
        }

        // 3️⃣ Check if category exists
        const category = await model.CheckCategoryExists(category_id);
        if (!category || category.length === 0) {
            return res.send({ result: false, message: "Category not found" });
        }

        // 4️⃣ Check for subcategories
        const subCategories = await model.CheckSubCategories(category_id);
        if (subCategories.length > 0) {
            return res.send({
                result: false,
                message: "Cannot delete category: subcategories exist under this category"
            });
        }

        // 5️⃣ Check for products
        const products = await model.CheckProducts(category_id);
        if (products.length > 0) {
            return res.send({
                result: false,
                message: "Cannot delete category: products exist under this category"
            });
        }

        // 6️⃣ Delete translations
        let deletetesalation = await model.DeleteCategoryTranslations(category_id);
        if (deletetesalation.affectedRows == 0) {
            return res.send({ result: true, message: "Failed to delete category traslation" });
        }
        // 7️⃣ Delete category
        const deleted = await model.DeleteCategoryRow(category_id);
        if (deleted.affectedRows > 0) {
            return res.send({ result: true, message: "Category deleted successfully" });
        } else {
            return res.send({ result: false, message: "Failed to delete category data" });
        }

    } catch (error) {
        console.error("DeleteCategory Error:", error);
        return res.send({ result: false, message: error.message });
    }
};

module.exports.DeleteSubCategory = async (req, res) => {
  try {
    const lang = req.body.language || "en";
    const language = await languages(lang);
    const { subcategory_id } = req.body;
    const { role } = req.user || {};

    // 1️⃣ Validate input
    if (!subcategory_id) {
      return res.send({
        result: false,
        message: language?.subcategory_id_required || "Subcategory ID is required",
      });
    }

    // 2️⃣ Check user role
    if (role !== "admin" || !role) {
      return res.send({
        result: false,
        message: language?.Try_with_admin_level_Account || "Admin privileges required",
      });
    }

    // 3️⃣ Check if subcategory exists
    const subCategory = await model.GetSubcategoryById(subcategory_id);
    if (!subCategory || subCategory.length === 0) {
      return res.send({
        result: false,
        message: language?.subcategory_not_found || "Subcategory not found",
      });
    }

    // 4️⃣ Check for products under this subcategory
    const products = await model.CheckProductsBySubCategory(subcategory_id);
    if (products.length > 0) {
      return res.send({
        result: false,
        message:
          language?.subcategory_delete_failed_products_exist ||
          "Cannot delete subcategory: products exist under this subcategory",
      });
    }

    // 5️⃣ Delete translations
    const deleteTranslation = await model.DeleteSubCategoryTranslations(subcategory_id);
    if (deleteTranslation.affectedRows === 0) {
      return res.send({
        result: false,
        message:
          language?.subcategory_translation_delete_failed ||
          "Failed to delete subcategory translations",
      });
    }

    // 6️⃣ Delete the subcategory itself
    const deleted = await model.DeleteSubCategoryRow(subcategory_id);
    if (deleted.affectedRows > 0) {
      return res.send({
        result: true,
        message: language?.subcategory_deleted_success || "Subcategory deleted successfully",
      });
    } else {
      return res.send({
        result: false,
        message: language?.subcategory_delete_failed || "Failed to delete subcategory",
      });
    }
  } catch (error) {
    console.error("DeleteSubCategory Error:", error);
    return res.send({
      result: false,
      message: error.message || "An error occurred while deleting subcategory",
    });
  }
};
