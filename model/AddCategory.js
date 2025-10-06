var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active' and user_role = 'admin'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.GetCategoryByName = async (category_name, category_id = null) => {
    try {
        let Query = `SELECT * FROM bh_product_categories WHERE LOWER(category_name) = ?`;
        const params = [category_name.toLowerCase()];

        // If category_id is provided, exclude it from the check
        if (category_id) {
            Query += ` AND category_id != ?`;
            params.push(category_id);
        }

        const data = await query(Query, params);
        return data;

    } catch (error) {
        throw new Error(error.message);
    }
};



// module.exports.GetcategoryById = async (category_id) => {
//     var Query = `select * from bh_product_categories where category_id = ? and category_status ='active'`;
//     var data = query(Query, [category_id]);
//     return data;
// };

module.exports.AddCategory = async (category_name, category_image, status) => {
    var Query = `insert into bh_product_categories(category_name,category_image,category_status)values(?,?,?)`;
    var data = query(Query, [category_name, category_image, status]);
    return data;
};

module.exports.UpdateCategory = async (category_id, category_name, status) => {
    const Query = `UPDATE bh_product_categories SET category_name = ?,category_status = ? WHERE category_id = ? `;
    return await query(Query, [category_name, status, category_id]);
}

module.exports.UpdateCategoryimage = async (category_id, image) => {
    const Query = `UPDATE bh_product_categories SET category_image = ? WHERE category_id = ? `;
    return await query(Query, [image, category_id]);
}

module.exports.AddCategoryLang = async (category_id, lang_id, category_name) => {
    var Query = `insert into bh_category_translation(ct_c_id,ct_language_id,ct_language_name)values(?,?,?)`;
    var data = query(Query, [category_id, lang_id, category_name]);
    return data;
};

module.exports.Getcategorydata = async (category_id) => {
    var Query = `select * from bh_product_categories where category_id = ? `;
    var data = query(Query, [category_id]);
    return data;
};


module.exports.AddSubCategory = async (category_id, category_name, imagepath, status) => {
    var Query = `insert into bh_product_sub_categories(sc_category_id,sc_name,sc_image,sc_status)values(?,?,?,?)`;
    var data = query(Query, [category_id, category_name, imagepath, status]);
    return data;
};

module.exports.AddsubCategoryLang = async (category_id, lang_id, category_name) => {
    var Query = `insert into bh_subcategory_translation(sct_c_id,sct_language_id,sct_language_name)values(?,?,?)`;
    var data = query(Query, [category_id, lang_id, category_name]);
    return data;
};

module.exports.UpdateCategoryLang = async (category_id, lang_id, translated_name) => {
    const Query = `
    UPDATE bh_subcategory_translation
    SET sct_language_name = ?
    WHERE sct_c_id = ? AND sct_language_id = ?
  `;
    return query(Query, [translated_name, category_id, lang_id]);
}

module.exports.GetSubcategoryById= async (subcategory_id) => {
  const Query = `SELECT * FROM bh_product_sub_categories WHERE sc_id = ?`;
   let data = query(Query, [subcategory_id]);
   return data
}

module.exports.GetSubcategoryByname = async (category_name, subcategory_id = null) => {
    try {
        let Query = `SELECT * FROM bh_product_sub_categories WHERE LOWER(sc_name) = ?`;
        const params = [category_name.toLowerCase()];

        // If category_id is provided, exclude it from the check
        if (subcategory_id) {
            Query += ` AND sc_id != ?`;
            params.push(subcategory_id);
        }

        const data = await query(Query, params);
        return data;

    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports.UpdateSubCategoryImage = async (subcategory_id, image) => {
    const Query = `UPDATE bh_product_sub_categories SET sc_image = ? WHERE sc_id = ? `;
    return await query(Query, [image, subcategory_id]);
}

module.exports.UpdateSubCategory= async (subcategory_id, category_id, category_name, status) => {
  const Query = `UPDATE bh_product_sub_categories SET sc_category_id = ?, sc_name = ?, sc_status = ? WHERE sc_id = ?`;
  return await query(Query, [category_id, category_name, status, subcategory_id]);
}

module.exports.UpdateSubCategoryLang = async (subcategory_id, lang_id, name) => {
  const Query = `UPDATE bh_subcategory_translation SET sct_language_name = ? WHERE sct_c_id = ? AND sct_language_id = ?`;
  return await query(Query, [name, subcategory_id, lang_id]);
}

