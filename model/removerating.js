var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUser = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_role = 'admin'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.CheckRating = async (offer_id) => {
    var Query = `select * from bh_product_rating where product_rating_id = ? and rating_status = 'active'`;
    var data = query(Query, [offer_id]);
    return data;
};

module.exports.RemoveRating = async (user_id,rating_id) => {
    var Query = `UPDATE bh_product_rating
                SET rating_status = 'removed',rating_removed_by = ?
                WHERE product_rating_id = ?`;
    var data = query(Query, [user_id,rating_id]);
    return data;
};