var model = require("../model/login");
var { languages } = require("../languages/languageFunc");
var bcrypt = require("bcrypt");
var randtoken = require('rand-token');
const { GenerateToken } = require('../util/jwt')

module.exports.Login = async (req, res) => {
  try {
    var lang = req.body.language;
    var language = await languages(lang);

    let device_id = req.body.device_id;
    let device_os = req.body.device_os;
    let device_token = req.body.device_token;
    let password = req.body.password;
    let email = req.body.email;
    let app_version = req.body.app_version;

    // if (
    //   !device_id ||
    //   !device_os ||
    //   !device_token ||
    //   !password ||
    //   !email
    // ) {
    //   return res.send({
    //     result: false,
    //     message: language.insufficient_parameters,
    //   });
    // }
    let CheckUser = await model.CheckUserQuery(email);
    if (CheckUser.length > 0) {
      if (CheckUser[0].user_email_verification == 'no') {
        return res.send({
          result: false,
          message: language.email_not_verified
        })
      }
      let Checkpassword = await bcrypt.compare(
        password,
        CheckUser[0].user_password
      );
      if (Checkpassword == false) {
        return res.send({
          result: false,
          message: language.wrong_credential,
        });
      }
      // let CheckUserapps = await model.CheckUserAppsQuery(
      //   CheckUser[0].user_id,
      //   device_id,
      //   device_os
      // );
      // var api_key = null;
      // if (CheckUserapps.length > 0) {
      //   api_key = randtoken.generate(32);
      //   await model.UpdateUserAppsQuery(
      //     device_token,
      //     api_key,
      //     app_version,
      //     CheckUserapps[0].user_apps_id)
      // } else {
      //   api_key = randtoken.generate(32);
      //   await model.InsertUserAppsQuery(
      //     device_id,
      //     device_os,
      //     device_token,
      //     CheckUser[0].user_id,
      //     api_key,
      //     app_version
      //   )
      // }
      const token = GenerateToken({
        user_id: CheckUser[0].user_id,
        name: CheckUser[0].user_name,
        email: CheckUser[0].user_email,
        mobile: CheckUser[0].user_mobile,
        role: CheckUser[0].user_role,
        status: CheckUser[0].user_status
      })
      return res.send({
        result: true,
        message: language.logged_in,
        user_id: CheckUser[0].user_id,
        user_name: CheckUser[0].user_name,
        user_email: CheckUser[0].user_email,
        user_mobile: CheckUser[0].user_mobile,
        user_role: CheckUser[0].user_role,
        // user_api_key: api_key,
        user_api_key: token,
        user_profile_pic: CheckUser[0].user_profile_pic
      })
    } else {
      return res.send({
        result: false,
        message: language.email_not_registered,
      });
    }
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
