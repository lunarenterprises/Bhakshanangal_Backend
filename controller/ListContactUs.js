var model = require("../model/ListContactUs");
var { languages } = require("../languages/languageFunc");

module.exports.ListContactus = async (req, res) => {
    try {
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        var { user_id } = req.headers;
        if (!user_id) {
            return res.send({
                result: false,
                message: "User id is required"
            })
        }
        let contactusList = await model.ListContactus();
        if (!contactusList) {
            return res.send({
                result: false,
                message: "Failed to retrive data"
            })
        } else {
            return res.send({
                result: true,
                message: "Successfully retrived Data",
                contactusList
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};