var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.productList = async (language, order_id) => {
    var Query = `SELECT 
    p.product_id,
    p.product_name,
    pr.price,
    p.quantity,
    i.image_file,
    o.order_id,
    opp.order_product_quantity AS order_quantity,
    opp.order_product_unit AS order_unit,
    o.gift_card,
    o.order_status,
    dv.delivery_mode_status,
    o.address_id
FROM 
    bh_order_details o
INNER JOIN 
    bh_order_product opp ON opp.order_product_order_id = o.order_id
INNER JOIN 
    bh_delivery_mode dv ON o.delivery_status = dv.delivery_mode_id
INNER JOIN 
    bh_products p ON opp.order_product_product_id = p.product_id
INNER JOIN 
    bh_product_translations t ON t.product_id = p.product_id
INNER JOIN 
    bh_languages l ON t.language_id = l.language_id
INNER JOIN 
    bh_product_prices pr ON pr.product_id = p.product_id
LEFT JOIN 
    bh_product_images i ON i.product_id = p.product_id
WHERE 
    l.language_code = ? 
    AND o.order_id = ?
`;
    var data = query(Query, [language, order_id]);
    return data;
};


module.exports.checkAddress = async (address_id) => {
    var Query = `select * from bh_address where address_id = ?`
    var data = query(Query, [address_id]);
    return data;
}

