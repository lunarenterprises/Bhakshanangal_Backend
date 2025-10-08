const db = require("../db/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.deleteCouponById = async (couponId) => {
    try {
        const sql = `DELETE FROM bh_coupon WHERE coupon_id = ?`;
        const result = await query(sql, [couponId]);
        return result;
    } catch (error) {
        throw error;
    }
};
