var model = require("../model/ContactUs");
var { languages } = require("../languages/languageFunc");

module.exports.CreateContactUs = async (req, res) => {
    try {
        var lang = req.body.language || 'en';
        var language = await languages(lang);
        let { user_id } = req.headers;
        if (!user_id) {
            return res.send({
                result: false,
                message: "User id is required"
            })
        }
        let { name, email, message } = req.body
        if (!name || !email || !message) {
            return res.send({
                result: false,
                message: "All fields are required"
            })
        }

        let CheckUser = await model.CheckUserQuery(user_id);
        if (CheckUser.length > 0) {
            let contactData = await model.InsertContactus(user_id, name, email, message)
            if (contactData.affectedData> 0) {
                return res.send({
                    result: true,
                    message: "Created contact us successfully",
                })
            } else {
                return res.send({
                    result: false,
                    message: "Failed to create contact us"
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
