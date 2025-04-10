var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.GetProducts = async (language, condition, cond, limit, page_no) => {
    var Query = `select distinct p.product_id,stock_stock as product_stock,product_name,price,quantity,product_unit,p.product_rating,p.product_rating_count from bh_products p
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
    var Query = `select distinct p.product_id,stock_stock as product_stock,product_name,price,quantity,product_unit,image_file,p.product_rating,p.product_rating_count from bh_products p
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

module.exports.GetAllProducts = async (product_id) => {
    var Query = `SELECT DISTINCT p.*, pc.*, ps.*, t.*, pr.* 
    FROM bh_products p LEFT JOIN bh_product_categories pc ON pc.category_id = p.category_id AND pc.category_status = 'active' 
    LEFT JOIN bh_product_stock ps ON ps.product_id = p.product_id 
    LEFT JOIN bh_product_translations t ON t.product_id = p.product_id AND t.language_id = ?
    LEFT JOIN bh_product_prices pr ON pr.product_id = p.product_id WHERE p.product_status = 'active' `
    var data = query(Query, [product_id]);
    return data;

}