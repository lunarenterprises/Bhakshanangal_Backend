var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = await query(Query, [user_id]);
    return data;
};

module.exports.CheckratingQuery = async (product_id) => {
    var Query = `select product_rating_id,product_rating_product_id,product_rating_user_id,product_rating_value,product_rating_comments,product_rating_date,user_name,user_email from bh_product_rating
    inner join bh_user on user_id = product_rating_user_id
     where product_rating_product_id = ? and rating_status = 'active'`;
    var data = await query(Query, [product_id]);
    return data;
};