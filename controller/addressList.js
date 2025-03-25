var model = require('../model/addressList')
var { languages } = require("../languages/languageFunc");


module.exports.ListOfAddress = async (req, res) => {
    try {
        var lang = req.body.language;
        var language = await languages(lang);
        let {address_id} = req.body
        var page_no = req.body.page_no ? Number(req.body.page_no) - 1 : 0
    var limit = req.body.limit ? req.body.limit : 15
    // var starting_offset = (limit * page_no) - limit;
    // console.log(starting_offset, "starting_offset");
    var ending_offset = limit * page_no
        let CheckUser = await model.CheckUserQuery(req.headers.user_id)
        if (CheckUser.length > 0) {
            let CheckAddress = await model.CheckAddressQuery(req.headers.user_id,address_id,page_no,limit)
            let totalData = await model.CheckAddressQuery1(req.headers.user_id,address_id)
            if (CheckAddress.length > 0) {
                return res.send({
                    result: true,
                    message: language.data_retrieved,
                    current_data_count:CheckAddress.length,
                    total_data_count:totalData.length,
                    list: CheckAddress
                })
            } else {
                return res.send({
                    result: false,
                    message: language.data_not_found
                })
            }
        } else {
            return res.send({
                result: false,
                message: language.user_does_not_exist,
            })
        }


    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}