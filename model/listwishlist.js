var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUser = async(user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query,[user_id]);
    return data;
};

module.exports.wishcheck = async(user_id) => {
    var Query = `select * from bh_wishlist where wish_user_id = ?`
    var data = query(Query,[user_id]);
    return data;
};

module.exports.GetProducts = async (language,product_id) => {
    var Query = `select p.product_id,product_name,price,quantity,product_unit,image_file,p.product_rating,p.product_rating_count from bh_products p
    inner join bh_product_translations t on t.product_id = p.product_id
    inner join bh_languages l on t.language_id = l.language_id 
    inner join bh_product_prices pr on pr.product_id = p.product_id
    left join bh_product_images i on i.product_id = p.product_id
    where l.language_code = ? and p.product_status = 'active' and p.product_id in(?)`;
    // console.log(Query, "Query");
    var data = query(Query, [language,product_id]);
    return data;
};
