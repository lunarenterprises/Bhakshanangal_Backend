var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.GetProducts = async (language, condition, cond, limit, page_no) => {
    var Query = `select distinct p.product_id,stock_stock as product_stock,product_name,price,quantity,p.product_rating,p.product_rating_count from bh_products p
    inner join bh_product_categories pc on pc.category_id = p.category_id and category_status ='active'
    inner join bh_product_stock ps on p.product_id = ps.product_id
    inner join bh_product_translations t on t.product_id = p.product_id
    inner join bh_languages l on t.language_id = l.language_id 
    inner join bh_product_prices pr on pr.product_id = p.product_id
    where l.language_code = ? and p.product_status = 'active'  ${condition} ${cond}  limit ? offset ?`;
    // console.log(Query, "Query");
    var data = query(Query, [language, limit, page_no]);
    return data;
};

module.exports.GetProducts1 = async (language, condition, cond) => {
    var Query = `select distinct p.product_id,stock_stock as product_stock,product_name,price,quantity,image_file,p.product_rating,p.product_rating_count from bh_products p
     inner join bh_product_categories pc on pc.category_id = p.category_id and category_status ='active'
      inner join bh_product_stock ps on p.product_id = ps.product_id
    inner join bh_product_translations t on t.product_id = p.product_id
    inner join bh_languages l on t.language_id = l.language_id 
    inner join bh_product_prices pr on pr.product_id = p.product_id
    left join bh_product_images i on i.product_id = p.product_id
    where l.language_code = ? and p.product_status = 'active'  ${condition} ${cond} `;
    var data = query(Query, [language]);
    return data;
};

module.exports.GetCategories = async (condition) => {
    console.log(condition, "conditionnnn");
    var Query = `select * from bh_product_categories ${condition}`;
    var data = query(Query);
    return data;
};

module.exports.GetCategories1 = async (category_id) => {
    var Query = `select * from bh_product_categories where category_id = ?`;
    var data = query(Query, [category_id]);
    return data;
};

module.exports.Getwishlist = async (user_id, product_id) => {
    var Query = `select * from bh_wishlist where wish_user_id = ? and wish_product_id = ?`;
    var data = query(Query, [user_id, product_id]);
    return data;
};

module.exports.GetDiscount = async (current_date, product_id) => {
    var Query = `SELECT * 
FROM bh_offers bo
INNER JOIN bh_product_offers o ON bo.offer_id = o.offer_id
WHERE bo.offer_start_date <= ? AND bo.offer_end_date >= ? and product_id = ?`
    var data = query(Query, [current_date, current_date, product_id]);
    return data;

}

module.exports.GetImages = async (product_id) => {
    var Query = `SELECT image_file from bh_product_images
 where product_id = ? and image_priority = 0`
    var data = query(Query, [product_id]);
    return data;

}

// module.exports.GetAllProducts = async () => {
//     var Query = `SELECT DISTINCT p.*, pc.*, ps.*, t.*, pr.* 
//     FROM bh_products p LEFT JOIN bh_product_categories pc ON pc.category_id = p.category_id AND pc.category_status = 'active' 
//     LEFT JOIN bh_product_stock ps ON ps.product_id = p.product_id 
//     LEFT JOIN bh_product_translations t ON t.product_id = p.product_id
//     LEFT JOIN bh_product_prices pr ON pr.product_id = p.product_id WHERE p.product_status = 'active' `
//     var data = query(Query);
//     return data;
// }

module.exports.GetAllProducts = async ({category_id, sub_category_id = null, search = '', page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;

    let Query = `
        SELECT p.*, pc.*, psc.sc_id AS sub_category_id, psc.sc_name AS sub_category_name
        FROM bh_products p
        LEFT JOIN bh_product_categories pc 
               ON pc.category_id = p.category_id AND pc.category_status = 'active'
        LEFT JOIN bh_product_sub_categories psc 
               ON psc.sc_id = p.sub_category_id AND psc.sc_status = '1'
        WHERE p.product_status = 'active'
    `;

    const params = [];

   if (category_id) {
        Query += ` AND p.category_id = ?`;
        params.push(category_id);
    }

    if (sub_category_id) {
        Query += ` AND p.sub_category_id = ?`;
        params.push(sub_category_id);
    }

    // Add search filter if provided
    if (search && search.trim() !== '') {
        Query += ` AND (p.product_name LIKE ? OR pc.category_name LIKE ? OR psc.sc_name LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Order by latest created
    Query += ` ORDER BY p.created_at DESC`;

    // Pagination
    Query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    return await query(Query, params);
};




module.exports.GetProductVariants = async (product_id) => {
    let Query = `
        SELECT v.bpv_id,
        bpv_size,
        bpv_unit,
        bpv_stock,
        bpv_price,
        bpv_discount,
               COALESCE(JSON_ARRAYAGG(
                   JSON_OBJECT(
                       'pv_id', i.pv_id,
                       'pv_file', i.pv_file,
                       'pv_created_at', i.pv_created_at,
                       'pv_updated_at', i.pv_updated_at
                   )
               ), JSON_ARRAY()) AS images
        FROM bh_product_variants v
        LEFT JOIN bh_product_variant_images i 
               ON i.pv_variant_id = v.bpv_id
        WHERE v.bpv_product_id = ?
        GROUP BY v.bpv_id
    `;
    return await query(Query, [product_id]);
}


module.exports.GetProductTranslation = async (product_id) => {
    let Query = `
        SELECT t.*, l.language_name, l.language_code
        FROM bh_product_translations t
        JOIN bh_languages l 
          ON l.language_id = t.language_id
        WHERE t.product_id = ?
    `;
    return await query(Query, [product_id]);
}

module.exports.GetProductById = async (product_id) => {
    let Query = `SELECT p.*, pc.*
        FROM bh_products p
        LEFT JOIN bh_product_categories pc 
               ON pc.category_id = p.category_id AND pc.category_status = 'active'
        WHERE p.product_status = 'active' and p.product_id=?`
    return await query(Query, [product_id])
}