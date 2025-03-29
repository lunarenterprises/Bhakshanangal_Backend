var model = require("../model/viewCart.js");
var { languages } = require("../languages/languageFunc");

module.exports.ViewCart = async (req, res) => {

    try {


        var lang = req.body.language || 'en';
        var language = await languages(lang);
        let user_id = req.headers.user_id;

        let CheckUser = await model.CheckUserQuery(user_id);
        if (CheckUser.length > 0) {
            let checkCart = await model.checkInCart(lang, user_id)
            if (checkCart.length > 0) {
                return res.send({
                    result: true,
                    message: language.data_retrieved,
                    data: checkCart
                })


            } else {
                return res.send({
                    result: false,
                    message: language.cart_item_not_found
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
};
