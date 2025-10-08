const model = require('../model/editCouponCode');

module.exports.editCouponCode = async (req, res) => {
    try {
        const { coupon_id, couponCode, isActive, expiryDate, couponDiscount, minPurchaseAmount } = req.body;
        if (!coupon_id || !couponCode || isActive === undefined || !expiryDate || !couponDiscount || !minPurchaseAmount) {
            return res.status(400).send({
                result: false,
                message: "All fields are required."
            });
        }
        const result = await model.editCouponCode(coupon_id, couponCode, isActive, expiryDate, couponDiscount, minPurchaseAmount);
        if (result.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Coupon updated successfully."
            });
        } else {
            return res.status(404).send({
                result: false,
                message: "Coupon not found."
            });
        }
    } catch (error) {
        return res.status(500).send({
            result: false,
            message: error.message
        });
    }
};
