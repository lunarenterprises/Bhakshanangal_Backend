var model = require("../model/productdropdown");
var { languages } = require("../languages/languageFunc");

module.exports.ProductDropDown = async (req, res) => {
    try {
        var lang = req.body.lang || 'en';
        var language = await languages(lang);
        const { user_id } = req?.user || req?.headers
        let search = req.body.search
        let checkadmin = await model.CheckAdmin(user_id);
        if (checkadmin.length > 0) {
            let getcategory = await model.GetCategory(search)
            if (getcategory.length > 0) {
                let getproduct = await model.GetProduct(lang, getcategory[0].category_id);
                if (getproduct.length > 0) {
                    return res.send({
                        result: true,
                        message: language.data_retrieved,
                        list: getproduct
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
                    message: language.data_not_found
                })
            }

        } else {
            return res.send({
                result: false,
                message: language.User_not_found
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}