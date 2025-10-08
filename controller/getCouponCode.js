const model = require('../model/getCouponCode');

module.exports.getCouponById = async (req, res) => {
    try {
        const { coupon_id } = req.body;
        if (!coupon_id) {
            return res.status(400).send({
                result: false,
                message: "coupon_id is required."
            });
        }
        const coupon = await model.getCouponById(coupon_id);
        if (coupon) {
            return res.send({
                result: true,
                coupon
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
