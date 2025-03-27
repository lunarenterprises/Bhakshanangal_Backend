var model = require("../model/UpdateDeliveryStatus");
var { languages } = require("../languages/languageFunc");

module.exports.UpdateDeliveryDate = async (req, res) => {
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
        let { order_id, delivery_status, delivery_date } = req.body
        if (!order_id || !delivery_date || !delivery_status) {
            return res.send({
                result: false,
                message: "Order id, Delivery date and status is required"
            })
        }
        let checkuser = await model.CheckUser(user_id);
        if (checkuser.length > 0) {
            let updated = await model.UpdateDeliveryStatus(order_id, delivery_status, delivery_date)
            if (updated.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: "Successfully updated delivery status and date"
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to update delivery status and date"
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