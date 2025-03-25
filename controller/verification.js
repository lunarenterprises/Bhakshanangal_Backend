var model = require("../model/verification");
var { languages } = require("../languages/languageFunc");
var moment = require('moment')

module.exports.Verification = async (req, res) => {
  try {
    let { email, code } = req.body;
    var lang = req.body.language;
    var language = await languages(lang);
    if (!email || !code) {
      return res.send({
        result: false,
        message: language.insufficient_parameters,
      });
    }
    let CheckUser = await model.CheckUserQuery(email);
    if (CheckUser.length > 0) {
      let CheckVerificationCode = await model.CheckVerificationQuery(
        CheckUser[0].user_id,
        parseInt(code)
      );

      if (CheckVerificationCode.length > 0) {
        var date = moment().format("YYYY-MM-DD")
        await model.UpdateUserinfoQuery(CheckUser[0].user_id, date)
        return res.send({
          result: true,
          message: language.verification_code_successfully_verified,
        });
      } else {
        return res.send({
          result: false,
          message: language.verification_code_entered_is_wrong,
        });
      }
    } else {
      return res.send({
        result: false,
        message: language.user_does_not_exist,
      });
    }
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
