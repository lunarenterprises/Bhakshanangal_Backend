var model = require("../model/deliverystatuslist");
var { languages } = require("../languages/languageFunc");

module.exports.DeliveryStatusList = async (req, res) => {
    try {
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        let user_id = req.headers.user_id
        let checkadmin = await model.CheckAdminQuery(user_id)
        if (checkadmin.length > 0) {
            let status_list = await model.CheckdeliverystatusQuery()
            return res.send({
                result: true,
                message: language.data_retrieved,
                list: status_list
            })

        } else {
            return res.send({
                result: false,
                message: language.Try_with_admin_level_Account,
            });
        }




    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}