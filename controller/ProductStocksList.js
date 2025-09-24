var model = require('../model/ProductStocksList')
var { languages } = require("../languages/languageFunc");

module.exports.ProductStocksList = async (req, res) => {
    try {
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        const { user_id } = req?.user || req?.headers
        let CheckUsers = await model.CheckUser(user_id)
        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 10
        var starting_offset = (limit * page_no) - limit;
        let search = req.body.search
        if (CheckUsers.length > 0) {
            var condition = ``
            if (search) {
                condition = ` and product_name like '${search}%'`
            }
            let productStockdetails = await model.GetProducts(lang, condition, limit, starting_offset)
            let TotalCount = await model.ProductTotalCount(lang, condition)


            if (productStockdetails.length > 0) {
                return res.send({
                    result: true,
                    message: language.data_retrieved,
                    list: productStockdetails,
                    totalcount: TotalCount.length
                })
            } else {
                return res.send({
                    result: false,
                    message: language.data_not_found
                })
            }
        } else {
            return res.send({
                result: false,
                message: language.user_does_not_exist
            })
        }

    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message
        })
    }
}