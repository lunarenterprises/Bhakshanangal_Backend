var model = require("../model/change_password");
var { languages } = require("../languages/languageFunc");
var bcrypt = require("bcrypt");

module.exports.ChangePassword = async (req, res) => {
  try {
    let { email, password } = req.body;
    var lang = req.body.language;
    var language = await languages(lang);
    if (!email || !password) {
      return res.send({
        result: false,
        message: language.insufficient_parameters,
      });
    }
    let CheckUser = await model.CheckUserQuery(email);
    if (CheckUser.length > 0) {
      var hashedPassword = await bcrypt.hash(password, 10);
      await model.ChangepasswordQuery(
        CheckUser[0].user_id,
        hashedPassword
      );
      return res.send({
        result: true,
        message: language.password_has_been_changed_successfully,
      });
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
