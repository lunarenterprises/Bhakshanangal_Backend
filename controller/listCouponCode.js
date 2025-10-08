const model = require('../model/listCouponCode');

module.exports.listCouponCodes = async (req, res) => {
    try {
        let { page = 1, limit = 20 } = req.body;
        page = parseInt(page);
        limit = parseInt(limit);
        const result = await model.listCouponCodes(page, limit);
        return res.send({
            result: true,
            total: result.total,
            page,
            limit,
            coupons: result.coupons
        });
    } catch (error) {
        return res.status(500).send({
            result: false,
            message: error.message
        });
    }
};
