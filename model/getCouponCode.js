const db = require("../db/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.getCouponById = async (couponId) => {
    try {
        const sql = `SELECT * FROM bh_coupon WHERE coupon_id = ?`;
        const result = await query(sql, [couponId]);
        return result && result.length > 0 ? result[0] : null;
    } catch (error) {
        throw error;
    }
};
