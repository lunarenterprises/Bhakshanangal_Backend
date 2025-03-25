var { languages } = require("../languages/languageFunc")
var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);
var moment = require("moment");

module.exports.ApikeyVerify = async (req, res, next) => {
    try {
        var lang = req.body.language;
        var language = await languages(lang);
        var user_id = req.headers.user_id;
        var api_key = req.headers.api_key;

        if (!user_id || !api_key) {
            return res.send({
                result: false,
                message: language.customer_empy_and_api_key_empty,
            })
        } else {
            let CheckVerification = await CheckVerificationQuery(parseInt(user_id), api_key)
            console.log(CheckVerification,parseInt(user_id), api_key,1);
            if (CheckVerification.length > 0) {
                let user_info = await UserInfoQuery(user_id);
                if (user_info.length > 0) {
                    let userStatus = user_info[0].user_status;
                    if (userStatus == "inactive") {
                        return res.send({
                            result: false,
                            message: language.account_inactive,
                        });
                    } else if (userStatus == "removed") {
                        return res.send({
                            result: false,
                            message: language.account_removed,
                        });
                    }
                    let user_last_access = moment().format("YYYY-MM-DD HH:mm:ss");
                    let user_access_mode = CheckVerification[0].user_apps_device_os

                    await UpdateUserInfoQuery(user_id, user_last_access, user_access_mode)

                    next()

                } else {
                    return res.send({
                        result: false,
                        message: language.Invalid_user_authentication,
                    });
                }
            } else {
                return res.send({
                    result: false,
                    message: language.api_key_changed,
                });

            }
        }



    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}

async function CheckVerificationQuery(user_id, api_key) {
    var Query = `select * from bh_user_apps where user_apps_user_id = ? and user_apps_key = ?`;
    var data = query(Query, [user_id, api_key]);
    return data;
};

async function UserInfoQuery(user_id) {
    var Query = `select * from bh_user where user_id = ?`;
    var data = query(Query, [user_id]);
    return data;
};

async function UpdateUserInfoQuery(user_id, user_last_access, user_access_mode) {
    var Query = `update bh_user set user_last_access = ?,user_access_mode = ? where user_id = ?`;
    var data = query(Query, [user_last_access, user_access_mode, user_id]);
    return data;
};