var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active' and user_role = 'admin'`;
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.Getbanner = async (banner_name) => {
    var Query = `select * from bh_banner where banner_name = ?`;
    var data = await query(Query, [banner_name]);
    return data;
};

module.exports.AddBanner = async ({
    banner_name,          // normalized name (e.g., lowercase)
    description,          // text
    image_path,           // stored file path
    category_id = null,   // optional FK
    product_id = null,    // optional FK
}) => {
    // Allowlist of columns we support inserting
    const cols = [];
    const vals = [];
    const params = [];

    if (banner_name !== undefined) {
        cols.push('banner_name');
        vals.push('?');
        params.push(banner_name);
    }
    if (description !== undefined) {
        cols.push('description');
        vals.push('?');
        params.push(description);
    }
    if (image_path !== undefined) {
        cols.push('banner_image');
        vals.push('?');
        params.push(image_path);
    }
    if (category_id !== undefined) {
        cols.push('category_id');
        vals.push('?');
        params.push(category_id === null ? null : Number(category_id));
    }
    if (product_id !== undefined) {
        cols.push('product_id');
        vals.push('?');
        params.push(product_id === null ? null : Number(product_id));
    }

    // Fallback: ensure minimum required fields
    if (cols.length === 0) {
        throw new Error('No columns to insert');
    }

    const Query = `
    INSERT INTO bh_banner (${cols.map(c => `\`${c}\``).join(', ')})
    VALUES (${vals.join(', ')})
  `;

    // Execute
    const result = await query(Query, params);

    // If using mysql2, result.insertId contains the new PK
    // return it for convenience
    return result;
};
