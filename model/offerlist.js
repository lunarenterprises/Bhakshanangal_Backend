var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.productList = async (language,offer_id) => {
    var Query = `select p.product_id,product_name,price,quantity,image_file from bh_product_offers o
    inner join bh_products p on o.product_id = p.product_id
    inner join bh_product_translations t on t.product_id = p.product_id
    inner join bh_languages l on t.language_id = l.language_id 
    inner join bh_product_prices pr on pr.product_id = p.product_id
    left join bh_product_images i on i.product_id = p.product_id
    where l.language_code = ? and offer_id = ?`;
    var data = query(Query, [language,offer_id]);
    return data;
};
 
module.exports.offerList = async (current_date) => {
    var Query = `select * from bh_offers where offer_status = 'active' `;
    var data = query(Query);
    return data;
}