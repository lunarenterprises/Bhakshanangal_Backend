var model = require("../model/removeoffer");
var { languages } = require("../languages/languageFunc");

module.exports.RemoveOffer = async (req, res) => {
    try {
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        const { user_id } = req?.user || req?.headers
        var offer_id = req.body.offer_id;
        let checkuser = await model.CheckUser(user_id)
        if (checkuser.length > 0) {
            let checkoffer = await model.CheckOffer(offer_id);
            if (checkoffer.length > 0) {
                let removeoffer = await model.RemoveOffer(user_id, offer_id);
                return res.send({
                    result: true,
                    message: language.Offer_removed_successfully
                })
            } else {
                return res.send({
                    result: false,
                    message: language.Offer_does_not_exists
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