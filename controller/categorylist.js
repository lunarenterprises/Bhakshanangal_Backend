var model = require('../model/categorylist')
var { languages } = require('../languages/languageFunc');

module.exports.CategoryList = async (req, res) => {
    try {
        var lang = req.body.language || 'en';
        var language = await languages(lang);
        let getcategory = await model.GetCategory(lang)
        let data = await Promise.all(getcategory.map(async (el) => {
            el.category_image = el.category_image
            let count = await model.GetProductCategoryCount(el.category_id)
            el.product_count = count.length
            return el
        }))

        if (getcategory.length > 0) {
            return res.send({
                result: true,
                message: language.data_retrieved,
                list: data
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
            message: error.message,
        })
    }

}