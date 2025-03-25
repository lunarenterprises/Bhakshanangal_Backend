var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUser = async(user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query,[user_id]);
    return data;
};

module.exports.CheckWishlist = async(user_id) => {
    var Query = `select * from bh_wishlist where wish_user_id = ?`;
    var data = query(Query,[user_id]);
    return data;
};