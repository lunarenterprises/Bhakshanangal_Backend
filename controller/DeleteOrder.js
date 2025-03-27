var model = require("../model/DeleteOrder")
var { languages } = require("../languages/languageFunc");

module.exports.DeleteOrder = async (req, res) => {
    try {
        var lang = req.body.language;
        var language = await languages(lang);
        var { user_id } = req.headers
        if (!user_id) {
            return res.send({
                result: false,
                message: "user id is required"
            })
        }
        var { order_id } = req.body;
        if (!order_id) {
            return res.send({
                result: false,
                message: "Order id is required"
            })
        }
        let checkuser = await model.CheckUserQuery(user_id);
        if (checkuser.length > 0) {
                let productdelete = await model.DeleteOrder(order_id);
                if (productdelete.affectedRows > 0) {
                    return res.send({
                        result: true,
                        message: language.order_deleted_successfully
                    })
                } else {
                    return res.send({
                        result: false,
                        message: language.order_delete_failed
                    })
                }
        } else {
            return res.send({
                result: false,
                message: language.user_does_not_exist
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}