var model = require("../model/listuser");
var { languages } = require("../languages/languageFunc");
var moment = require("moment");

module.exports.ListUser = async (req, res) => {
    try {
        var lang = req.body.lang || 'en';
        var search = req.body.search
        var language = await languages(lang);
        var user_id = req.headers.user_id;
        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 10
        var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset");
        var ending_offset = limit * page_no
        //  let Checkadmin = await model.CheckAdminQuery(user_id);
        // if (Checkadmin.length > 0) {
        let condition = ``
        if (search) {
            condition = `and (lower(user_name) like '${search.toLowerCase()}%' or lower(user_email) like '${search.toLowerCase()}%' or user_mobile like '${search}%')`
        }
        console.log(page_no, limit, starting_offset, "page_no");
        let userList = await model.Userlist(condition, limit, starting_offset)
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