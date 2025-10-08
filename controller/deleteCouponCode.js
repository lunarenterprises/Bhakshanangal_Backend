const model = require('../model/deleteCouponCode');

module.exports.deleteCouponById = async (req, res) => {
    try {
        const { coupon_id } = req.body;
        if (!coupon_id) {
            return res.status(400).send({
                result: false,
                message: "coupon_id is required."
            });
        }
        const result = await model.deleteCouponById(coupon_id);
        if (result.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Coupon deleted successfully."
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
