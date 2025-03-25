var model = require("../model/deletebanner");
var { languages } = require("../languages/languageFunc");

module.exports.DeleteBanner = async (req, res) => {
  try {
    var lang = req.body.language || "en";
    var language = await languages(lang);
    var user_id = req.headers.user_id;
    var banner_id = req.body.banner_id;
    let checkadmin = await model.CheckAdminQuery(user_id);
    if (checkadmin.length > 0) {
      let checkbanner = await model.CheckBanner(banner_id);
      if (checkbanner.length > 0) {
        let removebanner = await model.RemoveBanner(banner_id);
        return res.send({
          result: true,
          message: language.Banner_removed_successfully,
        });
      } else {
        return res.send({
          result: false,
          message: language.Banner_already_removed,
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
