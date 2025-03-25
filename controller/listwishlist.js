var model = require("../model/listwishlist");
var { languages } = require("../languages/languageFunc");

module.exports.ListWishlist = async (req, res) => {
    try {
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        var user_id = req.headers.user_id;
        let checkuser = await model.CheckUser(user_id);
        if (checkuser.length > 0) {
            let checkwish = await model.wishcheck(user_id);
            console.log(checkwish);
            if (checkwish.length > 0) {
                let product_id = checkwish.map(el => {
                    return el.wish_product_id
                })
                console.log(product_id);
                let productdata = await model.GetProducts(lang, product_id)
                productdata.forEach(element => {
                    element.image_file = 'bhakshanangal/' + element.image_file
                    element.product_rating = Number(element.product_rating).toFixed(1)
                });
                return res.send({
                    result: true,
                    message: language.retrieved,
                    list: productdata
                })
            } else {
                return res.send({
                    result: false,
                    message: language.wishlist_empty
                })
            }


        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};