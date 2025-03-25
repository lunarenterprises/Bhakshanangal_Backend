var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.SellingTop = async (language) => {
    // var Query = `SELECT op.order_product_product_id as product_id,t.product_name,i.image_file
    // FROM bh_order_details o
    // inner join bh_order_product op on op.order_product_order_id = o.order_id
    // inner join bh_product_translations t on t.product_id = op.order_product_product_id
    // inner join bh_languages l on t.language_id = l.language_id 
    // left join bh_product_images i on i.product_id = op.order_product_product_id
    // where l.language_code = ? 
    // GROUP BY op.order_product_product_id,t.product_name
    // ORDER BY COUNT(*) DESC
    // LIMIT 5;`;
    var Query = `SELECT 
    op.order_product_product_id AS product_id,
    t.product_name,pr.product_rating,prs.price,
    i.image_file,
    COUNT(op.order_product_product_id) AS product_count
FROM 
    bh_order_details o
INNER JOIN 
    bh_order_product op ON op.order_product_order_id = o.order_id
INNER JOIN 
    bh_product_translations t ON t.product_id = op.order_product_product_id
INNER JOIN 
    bh_languages l ON t.language_id = l.language_id 
INNER JOIN 
bh_order_product p ON p.order_product_order_id = o.order_id
INNER JOIN
bh_products pr on pr.product_id = p.order_product_product_id
INNER JOIN 
bh_product_prices prs on prs.product_id = pr.product_id
LEFT JOIN 
    bh_product_images i ON i.product_id = op.order_product_product_id
WHERE 
    l.language_code = ?
GROUP BY 
    op.order_product_product_id, t.product_name
ORDER BY 
    product_count DESC
LIMIT 5;
`
    var data = query(Query, [language]);
    return data;
};