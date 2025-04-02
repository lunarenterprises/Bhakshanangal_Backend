var model = require('../model/viewProduct')
var { languages } = require('../languages/languageFunc');
var moment = require('moment')
module.exports.ViewProducts = async (req, res) => {
    try {
        let { product_id } = req.body;
        var lang = req.body.language || 'en';
        var language = await languages(lang);
        let user_id = req.headers.user_id
        let date = moment().format("YYYY-MM-DD");
        let delivery_date = moment(date, "YYYY-MM-DD").add(7, 'days').format("YYYY-MM-DD");
        if (!product_id) {
            return res.send({
                result: false,
                message: language.insufficient_parameters,
            });
        }
        let getproduct = await model.GetProducts(lang, product_id)
        let Data = await Promise.all(getproduct.map(async (element) => {
            if (user_id) {
                let getwishlist = await model.Getwishlist(user_id, element.product_id)
                if (getwishlist.length > 0) {
                    var wishlist = true
                } else {
                    var wishlist = false
                }
                element.wishlist = wishlist
            }
            let imagesInproduct = await model.GetImages(element.product_id)
            imagesInproduct.forEach(el => {
                el.image_file =  el.image_file
            });
            let imagesInMain = await model.GetImagess(element.product_id)

            element.product_image = imagesInproduct
            element.image_file =  imagesInMain[0].image_file
            element.delivery_date = delivery_date
            element.product_rating = Number(element.product_rating).toFixed(1)
            return element
        }))

        if (getproduct.length > 0) {
            return res.send({
                result: true,
                message: language.data_retrieved,
                data: Data,
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