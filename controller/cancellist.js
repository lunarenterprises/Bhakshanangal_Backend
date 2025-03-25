var model = require("../model/cancellist");
var { languages } = require("../languages/languageFunc");

module.exports.CancelList = async (req, res) => {
    try {
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        var user_id = req.headers.user_id;
        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 15
        var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset");
        var ending_offset = limit * page_no
        console.log(user_id, "usreHJBCLDJC");
        let checkuser = await model.CheckUser(user_id);
        if (checkuser.length > 0) {
            let checklist = await model.CheckList(user_id, starting_offset, limit);

            if (checklist.length > 0) {
                let data = await Promise.all(checklist.map(async (el) => {
                    let getdetails = await model.productdata(lang, el.product_id)
                    el.product_name = getdetails[0].product_name
                    el.image_file = getdetails[0].image_file
                    el.product_rating = getdetails[0].product_rating
                    return el

                }))
                return res.send({
                    result: true,
                    message: language.data_retrieved,
                    cancelledlist: data
                })
            } else {
                return res.send({
                    result: false,
                    message: language.data_not_found,
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