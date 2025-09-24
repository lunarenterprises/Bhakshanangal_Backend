var model = require("../model/deleteproduct")
var { languages } = require("../languages/languageFunc");

module.exports.DeleteProduct = async (req, res) => {
    try {
        var lang = req.body.language;
        var language = await languages(lang);
        const { user_id } = req?.user || req?.headers
        var product_id = req.body.product_id;
        let checkuser = await model.CheckUserQuery(user_id);
        if (checkuser.length > 0) {
            let checkproduct = await model.CheckProduct(product_id);
            if (checkproduct.length > 0) {
                let productdelete = await model.DeleteProduct(product_id);
                return res.send({
                    result: true,
                    message: language.Product_removed_successfully
                })
            } else {
                return res.send({
                    result: false,
                    message: language.Product_already_removed
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