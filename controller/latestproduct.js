var model = require("../model/latestproduct");
var { languages } = require("../languages/languageFunc");

module.exports.LatestProduct = async (req, res) => {
    try {
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        var user_id = req.headers.user_id;
        // let checkuser = await model.CheckUser(user_id);
        // if (checkuser.length > 0) {
        let listproduct = await model.ListProduct(lang);
        let data = await Promise.all(listproduct.map(async (el) => {
            el.image_file = 'bhakshanangal/' + el.image_file
            return el
        }))
        if (listproduct.length > 0) {
            return res.send({
                result: true,
                message: language.data_retrieved,
                data: data
            })
        }
        // }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};