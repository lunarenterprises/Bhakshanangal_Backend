var model = require("../model/listuser");
var { languages } = require("../languages/languageFunc");
var moment = require("moment");

module.exports.ListUser = async (req, res) => {
    try {
        var lang = req.body.lang || 'en';
        var search = req.body.search
        var language = await languages(lang);
        var user_id = req.headers.user_id;
        let condition = ``
        if (search) {
            condition = `and (lower(user_name) like '${search.toLowerCase()}%' or lower(user_email) like '${search.toLowerCase()}%' or user_mobile like '${search}%')`
        }
        let userList = await model.Userlist(condition)
        let totalData = await model.Userlist1(condition)
        console.log(userList.length);
        if (userList.length > 0) {
            return res.send({
                result: true,
                message: language.data_retrieved,
                currentcount: userList.length,
                totalcount: totalData.length,
                list: userList
            })
        } else {
            return res.send({
                result: false,
                message: language.data_not_found,
            })
        }

        // } else {
        //     return res.send({
        //         result: false,
        //         message: language.Try_with_admin_level_Account
        //     })
        // }
    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message
        })
    }
}