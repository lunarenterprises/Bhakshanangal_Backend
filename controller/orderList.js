var model = require('../model/orderList')
var { languages } = require("../languages/languageFunc");

module.exports.orderList = async (req, res) => {
    try {
        var lang = req.body.lang || 'en'
        var language = await languages(lang);
        var user_id = req.headers.user_id;
        var search = req.body.search;

        var page_no = req.body.page_no ? Number(req.body.page_no) - 1 : 0
        var limit = req.body.limit ? req.body.limit : 15
        // var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset");
        var ending_offset = limit * page_no
        let selectUser = await model.UserSelect(user_id)
        let UserAll = await model.GetUserAll()
        if (selectUser.length > 0) {
            var i = 0;
            var condition = ``
            if (selectUser[0].user_role == 'admin') {
                condition = ``
                if (search) {
                    condition = ` and bo.order_status = '${search}'`
                }
            } else if (selectUser[0].user_role == 'user') {
                condition = ` and bo.user_id = '${user_id}'`
            }

            let total_count = await model.Getorder(condition)
            let getOrder = await model.Getorderpaginated(condition, page_no, limit)
            let datas = await Promise.all(getOrder.map(async (element) => {
                i += element.order_amount
                let address = await model.getAddress(element.address_id)
                let products = await model.productList(lang, element.product_id);
                let payment_details = await model.getPayment(element.order_id);
                element.address = address[0];
                element.payment_status = payment_details[0]?.payment_status;
                element.product = products;
                return element
            }))


            if (datas.length > 0) {
                return res.send({
                    result: true,
                    message: language.data_retrieved,
                    user_count: UserAll.length,
                    data: datas,
                    current_count: getOrder.length,
                    total_count: total_count.length,
                    sales: i
                });
            } else {
                return res.send({
                    result: false,
                    message: language.Order_not_found,
                });
            }

        } else {
            return res.send({
                result: false,
                message: language.user_does_not_exist,
            });
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
}