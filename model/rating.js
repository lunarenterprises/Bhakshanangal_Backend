var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.checkUserQuery = async (user_id) => {
    let getUserQuery = `select user_id from bh_user where user_id = ? and user_status = 'active'`
    let getUserResult = await query(getUserQuery, [user_id])
    return getUserResult;
}

module.exports.CheckResourceRatingQuery = async (user_id, product_id) => {
    let getUserQuery = `select * from bh_product_rating where product_rating_product_id = ? and product_rating_user_id = ?`
    let getUserResult = await query(getUserQuery, [product_id, user_id])
    return getUserResult;
}

module.exports.UpdateResourceRatingQuery = async (user_id, product_id, condition) => {
    let getUserQuery = `update bh_product_rating ${condition} where product_rating_product_id = ? and product_rating_user_id = ?`
    let getUserResult = await query(getUserQuery, [product_id, user_id])
    return getUserResult;
}

module.exports.CheckResourceRatedUserQuery = async (product_id) => {
    let getUserQuery = `select * from bh_product_rating where product_rating_product_id = ?`
    let getUserResult = await query(getUserQuery, [product_id])
    return getUserResult;
}

module.exports.CheckResourceAverageRatingQuery = async (product_id) => {
    let getUserQuery = `select product_rating from bh_products where product_id = ?`
    let getUserResult = await query(getUserQuery, [product_id])
    return getUserResult;
}

module.exports.UpdateResourceAverageRatingQuery = async (Calculate, product_id) => {
    let getUserQuery = `update bh_products set product_rating = ? where product_id = ?`
    let getUserResult = await query(getUserQuery, [Calculate, product_id])
    return getUserResult;
}

module.exports.InsertResourceRatingQuery = async (rating, comment, current_date, current_time, product_id, user_id) => {
    let val = ''
    let col = ''
    if (comment !== '' && comment !== undefined) {
        col = `,product_rating_comments`
        val = `,'${comment}'`
    }
    let getUserQuery = `insert into bh_product_rating(product_rating_product_id,product_rating_user_id,product_rating_value${col},product_rating_date,product_rating_time)values(?,?,?${val},?,?)`
    let getUserResult = await query(getUserQuery, [product_id, user_id, rating, current_date, current_time])
    return getUserResult;
}

module.exports.UpdateResourceAverageRatingQuery1 = async (Calculate, product_id) => {
    let getUserQuery = `UPDATE bh_products
    SET product_rating = ?,
        product_rating_count = CASE
            WHEN product_rating_count IS NULL THEN 1
            ELSE product_rating_count + 1
        END
    WHERE product_id = ?`
    let getUserResult = await query(getUserQuery, [Calculate, product_id])
    return getUserResult;
}