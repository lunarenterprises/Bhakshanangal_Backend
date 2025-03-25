var model = require("../model/removeAddress");
var { languages } = require("../languages/languageFunc");
const { log } = require("util");

module.exports.RemoveAddress = async (req,res) => {
  try {
    var lang = req.body.language;
    var language = await languages(lang);
    let { address_id } = req.body;

    if (!address_id) {
      return res.send({
        result: false,
        message: language.insufficient_parameters,
      });
    }
    let CheckUser = await model.CheckUserQuery(req.headers.user_id);
    if (CheckUser.length > 0) {
      await model.DeleteAddressQuery(address_id);

      return res.send({
        result: true,
        message: language.address_successfully_deleted,
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
