var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active' and user_role = 'admin'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.checkproductQuery = async (product_id) => {
    var Query = `select * from bh_products where product_id = ?`;
    var data = query(Query, [product_id]);
    return data;
};

module.exports.checkOfferQuery = async (offer_name, start_date, end_date) => {
    var Query = `select * from bh_offers where lower(offer_name) = ? and offer_start_date = ? and offer_end_date = ?`;
    var data = query(Query, [offer_name.toLowerCase(), start_date, end_date]);
    return data;
};

module.exports.AddOfferQuery = async (offer_name, offer_description, image, date, start_date, end_date, discount) => {
    var Query = `INSERT INTO bh_offers (offer_name, offer_description, offer_image, offer_status, offer_created_at, offer_start_date, offer_end_date,offer_discount)
    VALUES (?,?,?,?,?,?,?,?)`;
    var data = query(Query, [offer_name, offer_description, image, 'active  ', date, start_date, end_date, discount]);
    return data;
};

module.exports.getofferQuery = async () => {
    var Query = `SELECT offer_id 
    FROM bh_product_offers 
    ORDER BY offer_id DESC 
    LIMIT 1;
    `;
    var data = query(Query);
    return data;
}

module.exports.AddproductQuery = async (offer_id, product_id) => {
    var Query = `insert into bh_product_offers(offer_id,product_id)values(?,?)`;
    var data = query(Query, [offer_id, product_id]);
    return data;
}

module.exports.GetProduct = async(category_id) => {
    var Query = `select product_id from bh_products where category_id = ? and product_status = 'active'`;
    var data = await query(Query,[category_id]);
    return data;
};