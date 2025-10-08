
const db = require("../db/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.insertCouponCode = async (couponCode, isActive, expiryDate, couponDiscount, minPurchaseAmount) => {
    try {
        const sql = `INSERT INTO bh_coupon (coupon_code, is_active, expiry_date, coupon_discount, min_purchase_amount) VALUES (?, ?, ?, ?, ?)`;
        const result = await query(sql, [couponCode, isActive, expiryDate, couponDiscount, minPurchaseAmount]);
        return result;
    } catch (error) {
        throw error;
    }
};
module.exports.checkCouponCodeExists = async (couponCode) => {
    try {
        const sql = `SELECT coupon_id FROM bh_coupon WHERE coupon_code = ? LIMIT 1`;
        const result = await query(sql, [couponCode]);
        return result && result.length > 0;
    } catch (error) {
        throw error;
    }
};