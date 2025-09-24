var model = require("../model/ContactUs");
var { languages } = require("../languages/languageFunc");

module.exports.CreateContactUs = async (req, res) => {
    try {
        var lang = req.body.language || 'en';
        var language = await languages(lang);
        let { name, email, message } = req.body
        if (!name || !email || !message) {
            return res.send({
                result: false,
                message: "Name, email and message are required"
            })
        }
        let contactData = await model.InsertContactus(name, email, message)
        if (contactData.affectedRows > 0) {
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
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};
