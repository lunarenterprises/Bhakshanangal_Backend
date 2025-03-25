var model = require('../model/order_view')
var { languages } = require("../languages/languageFunc");

module.exports.OrderVIew = async (req, res) => {
    try {
        var lang = req.body.lang || 'en'
        var language = await languages(lang);
        var order_id = req.body.order_id
        var user_id = req.headers.user_id
        if (!order_id) {
            return res.send({
                result: false,
                message: language.insufficient_parameters
            })
        }
        let view = await model.productList(lang, order_id)

        console.log(view, "view");
        if (view.length > 0) {
            let datas = await Promise.all(view.map(async (el) => {
                let getaddress = await model.checkAddress(el.address_id)
                el.address = getaddress
                return el

            }))
            return res.send({
                result: true,
                message: language.data_retrieved,
                view: datas
            })
        } else {
            return res.send({
                result: false,
                message: language.data_not_found
            })
        }


    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}