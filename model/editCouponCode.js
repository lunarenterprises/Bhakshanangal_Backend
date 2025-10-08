const db = require("../db/db");
const util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.editCouponCode = async (coupon_id, couponCode, isActive, expiryDate, couponDiscount, minPurchaseAmount) => {
    try {
        const sql = `UPDATE bh_coupon SET coupon_code = ?, is_active = ?, expiry_date = ?, coupon_discount = ?, min_purchase_amount = ? WHERE coupon_id = ?`;
        const result = await query(sql, [couponCode, isActive, expiryDate, couponDiscount, minPurchaseAmount, coupon_id]);
        return result;
    } catch (error) {
        throw error;
    }
};
