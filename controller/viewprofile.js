var model = require('../model/viewprofile')
var { languages } = require("../languages/languageFunc");


module.exports.ViewProfile = async (req, res) => {
    try {
        var lang = req.body.language;
        var language = await languages(lang);
        const { user_id } = req?.user || req?.headers
        let CheckUser = await model.CheckUserQuery(user_id)
        if (CheckUser.length > 0) {
            var obj = {
                user_id: CheckUser[0].user_id,
                fist_name: CheckUser[0].user_name,
                last_name: CheckUser[0].user_last_name,
                email: CheckUser[0].user_email,
                mobile: CheckUser[0].user_mobile,
                address: {
                    address_id: CheckUser[0].address_id,
                    building_name: CheckUser[0].address_building_name,
                    area_name: CheckUser[0].address_area_name,
                    landmark: CheckUser[0].address_landmark,
                    city: CheckUser[0].address_city,
                    state: CheckUser[0].address_state,
                    pincode: CheckUser[0].address_pincode,
                    phone_number: CheckUser[0].address_phone_number,
                    alternate_phone_number: CheckUser[0].address_alt_phone_number,
                }
            }
            return res.send({
                result: true,
                message: language.data_retrieved,
                list: obj
            })

        } else {
            return res.send({
                result: false,
                message: language.user_does_not_exist,
            })
        }

    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message
        })
    }
}
