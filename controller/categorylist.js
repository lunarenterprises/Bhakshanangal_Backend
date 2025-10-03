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

module.exports.SubCategoryList = async (req, res) => {
    try {
        let {category_id }=req.body
        
    
        var lang = req.body.language || 'en';
        var language = await languages(lang);

            if (!category_id) {
            return res.send({
          result: false,
          message: language.insufficient_parameters,
        });
        }

        let getsubcategory = await model.GetSubCategory(category_id,lang)
        console.log("getsubcategory",getsubcategory)
        
        let data = await Promise.all(getsubcategory.map(async (el) => {
            el.category_image = el.sc_image
            let count = await model.GetProductSubCategoryCount(el.sc_id)
            el.product_count = count.length
            return el
        }))

        if (getsubcategory.length > 0) {
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