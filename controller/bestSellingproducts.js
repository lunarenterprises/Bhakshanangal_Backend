var model = require("../model/bestSellingproducts");
var { languages } = require("../languages/languageFunc");
var moment = require("moment");

module.exports.BestSellingProducts = async (req, res) => {
    try {
        var lang = req.body.language || "en";
        var language = await languages(lang);
        let user_id = req.headers.user_id;

        // let checkUser = await model.CheckAdminQuery(user_id);
        // if (checkUser.length > 0) {
            let bestSelling = await model.SellingTop(lang);
            bestSelling.forEach(element => {
                element.image_file = 'bhakshanangal/' + element.image_file
                element.product_rating = Number(element.product_rating).toFixed(1)
            });
            if (bestSelling.length > 0) {
                return res.send({
                    result: true,
                    message: language.data_retrieved,
                    data: bestSelling,
                });
            } else {
                return res.send({
                    result: false,
                    message: language.data_not_found,
                });
            }
        // } else {
        //     return res.send({
        //         result: false,
        //         message: language.User_not_found,
        //     });
        // }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
};
