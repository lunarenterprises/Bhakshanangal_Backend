var model = require("../model/removeAddress");
var { languages } = require("../languages/languageFunc");

module.exports.RemoveAddress = async (req, res) => {
  try {
    const { user_id } = req?.user || req?.headers
    var lang = req.body.language;
    var language = await languages(lang);
    let { address_id } = req.body;

    if (!address_id) {
      return res.send({
        result: false,
        message: language.insufficient_parameters,
      });
    }
    let CheckUser = await model.CheckUserQuery(user_id);
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
