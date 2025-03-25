var model = require('../model/ratinglist')
var { languages } = require("../languages/languageFunc");
var moment = require("moment");

module.exports.RatingList = async (req, res) => {
    let { product_id } = req.body
    var lang = req.body.lang || 'en';
    var language = await languages(lang);
    var user_id = req.headers.user_id;
    var page_no = req.body.page_no ? Number(req.body.page_no) : 1
    var limit = req.body.limit ? req.body.limit : 10
    var starting_offset = (limit * page_no) - limit;
    if (!product_id) {
        return res.send({
            result: false,
            message: language.insufficient_parameters
        })
    }
    // let CheckUser = await model.CheckUserQuery(user_id)
    // if (CheckUser.length > 0) {
        let ratedlist = await model.CheckratingQuery(product_id)
        // console.log(ratedlist, "ratedlist");
        if (ratedlist.length > 0) {
            return res.send({
                result: true,
                message: language.data_retrieved,
                data: ratedlist
            })
        } else {
            return res.send({
                result: false,
                message: language.data_not_found
            })
        }
    // } else {
    //     return res.send({
    //         result: false,
    //         message: language.User_not_found
    //     })
    // }

}