const db = require("../db/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.listCouponCodes = async (page = 1, limit = 20) => {
    try {
        const offset = (page - 1) * limit;
        const sql = `SELECT * FROM bh_coupon ORDER BY coupon_id DESC LIMIT ? OFFSET ?`;
        const data = await query(sql, [Number(limit), Number(offset)]);
        const countResult = await query('SELECT COUNT(*) as total FROM bh_coupon');
        return {
            coupons: data,
            total: countResult[0]?.total || 0
        };
    } catch (error) {
        throw error;
    }
};
