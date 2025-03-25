var model = require('../model/paymentlist')
var { languages } = require("../languages/languageFunc");

module.exports.PaymentList = async (req, res) => {
    // try {
    var lang = req.body.lang || 'en'
    var language = await languages(lang);
    var user_id = req.headers.user_id;
    var page_no = req.body.page_no ? Number(req.body.page_no) - 1 : 0
    var limit = req.body.limit ? req.body.limit : 15
    // var starting_offset = (limit * page_no) - limit;
    // console.log(starting_offset, "starting_offset");
    var ending_offset = limit * page_no
    let selectUser = await model.UserSelect(user_id)
    if (selectUser.length > 0) {
        let total_count = await model.Getorder()
        let getOrder = await model.Getorderpaginated(page_no, limit)
        console.log(getOrder, "getOrder");
        let datas = await Promise.all(getOrder.map(async (element) => {
            let products = await model.productList(lang, element.product_id);
            element.product = products
            return element
        }))



        return res.send({
            result: true,
            message: language.data_retrieved,
            data: datas,
            current_count: getOrder.length,
            total_count: total_count.length
        });
    } else {
        return res.send({
            result: false,
            message: 'admin level can view',
        });
    }
    // } catch (error) {
    //     return res.send({
    //         result: false,
    //         message: error.message,
    //     });
    // }
}