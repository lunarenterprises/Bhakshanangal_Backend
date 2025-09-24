var model = require('../model/setDefaultAddress')
var { languages } = require("../languages/languageFunc");
const { log } = require('util');

module.exports.SetDefaultAddress = async (req, res) => {
    try {


        var lang = req.body.language;
        var language = await languages(lang);
        let { address_id } = req.body
        const { user_id } = req?.user || req?.headers
        let CheckUser = await model.CheckUserQuery(user_id)
        if (CheckUser.length > 0) {
            let GetAddress = await model.getAddress(address_id)
            if (GetAddress.length == 0) {
                return res.send({
                    result: false,
                    message: language.address_not_found
                })
            }
            let SetAddress = await model.setAddress(address_id, user_id)
            let address = {
                address_id: GetAddress[0].address_id,
                building_name: GetAddress[0].address_building_name,
                area_name: GetAddress[0].address_area_name,
                landmark: GetAddress[0].address_landmark,
                city: GetAddress[0].address_city,
                state: GetAddress[0].address_state,
                pincode: GetAddress[0].address_pincode
            }
            console.log(SetAddress.affectedRows);
            if (SetAddress.affectedRows > 0) {
                return res.send({
                    result: true,
                    message: language.address_successfully_updated,
                    data: address
                })
            } else {
                return res.send({
                    result: false,
                    message: language.failed_to_update_address
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
}