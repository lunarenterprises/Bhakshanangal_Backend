var model = require("../model/addCouponCode");

module.exports.addCouponCode = async (req, res) => {
    try {
        const { couponCode, isActive, expiryDate, couponDiscount, minPurchaseAmount } = req.body;
        if (!couponCode || isActive === undefined || !expiryDate || !couponDiscount || !minPurchaseAmount) {
            return res.status(400).send({
                result: false,
                message: "Missing required coupon fields."
            });
        }
        const result = await model.insertCouponCode(couponCode, isActive, expiryDate, couponDiscount, minPurchaseAmount);
        return res.send({
            result: true,
            message: "Coupon code added successfully.",
            coupon_id: result.insertId || result[0]?.coupon_id || null
        });
    } catch (error) {
        return res.status(500).send({
            result: false,
            message: error.message
        });
    }
};
