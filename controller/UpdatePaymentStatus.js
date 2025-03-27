var model = require("../model/UpdatePaymentStatus");
var { languages } = require("../languages/languageFunc");

module.exports.UpdatePaymentStatus = async (req, res) => {
    try {
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        var { user_id } = req.headers
        if (!user_id) {
            return res.send({
                result: false,
                message: "User id is required"
            })
        }
        let { order_id, order_status } = req.body
        if (!order_id || !order_status) {
            return res.send({
                result: false,
                message: "Order id and Order status is required"
            })
        }
        let checkuser = await model.CheckUser(user_id);
        if (checkuser.length > 0) {
            let updated = await model.UpdateOrderStatus(order_id, order_status)
            if (updated.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "Successfully updated order status"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to update order status"
                })
            }
        } else {
            return res.send({
                result: false,
                message: "User not found."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};