var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.GetCategory = async (lang, offset, limit, search = '') => {
    let Query = `
        SELECT 
            category_id,
            ct_language_name AS category_name,
            category_image,
            category_status
        FROM bh_category_translation
        INNER JOIN bh_product_categories ON ct_c_id = category_id
        INNER JOIN bh_languages ON ct_language_id = language_id
        WHERE category_status = 'active' 
          AND language_code = ? `;

    const params = [lang];

    // Add search filter if provided
    if (search && search.trim() !== '') {
        Query += ` AND ct_language_name LIKE ?`;
        params.push(`%${search}%`);
    }

    // Add pagination
    Query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const data = await query(Query, params);
    return data;
};


module.exports.GetProductCategoryCount = async (category_id) => {
    var Query = `select * from bh_products where category_id = ?`;
    var data = query(Query, [category_id]);
    return data;
};
module.exports.GetCategoryCount = async () => {
    var Query = `select * from bh_product_categories`;
    var data = query(Query);
    return data;
};

module.exports.GetSubCategory = async (lang, category_id = null, search = '', offset , limit ) => {
    let Query = `
        SELECT 
            sc.sc_id, 
            sc.sc_category_id,
            sct.sct_language_name AS sc_name, 
            sc.sc_image, 
            sc.sc_status, 
            c.ct_language_name AS category_name
        FROM bh_subcategory_translation sct
        INNER JOIN bh_product_sub_categories sc ON sct.sct_c_id = sc.sc_id
        INNER JOIN bh_category_translation c ON sc.sc_category_id = c.ct_c_id AND c.ct_language_id = sct.sct_language_id
        INNER JOIN bh_languages l ON sct.sct_language_id = l.language_id
        WHERE sc.sc_status = '1' AND l.language_code = ? `;
    const params = [lang];

    // If category_id is provided, filter by it
    if (category_id) {
        Query += ` AND sc.sc_category_id = ?`;
        params.push(category_id);
    }
    
    // Else, if search is provided, filter by category name
    else if (search && search.trim() !== '') {
        Query += ` AND sct.sct_language_name LIKE ?`;
        params.push(`%${search}%`);
    }

    // Add pagination if limit > 0
    if (limit > 0) {
        Query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);
    }

    const data = await query(Query, params);

    return data;
};


module.exports.GetSubCategoryCount = async () => {
    var Query = `select * from bh_product_sub_categories`;
    var data = query(Query);
    return data;
};

module.exports.GetProductSubCategoryCount = async (category_id) => {
    var Query = `select * from bh_products where sub_category_id = ?`;
    var data = query(Query, [category_id]);
    return data;
};