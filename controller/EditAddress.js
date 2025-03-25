var model = require("../model/EditAddress");
var { languages } = require("../languages/languageFunc");

module.exports.EditAddresses = async (req, res) => {
  try {
    var lang = req.body.language;
    var language = await languages(lang);
    let {
      full_name,
      phone_number,
      alt_phone_number,
      pincode,
      state,
      city,
      building_name,
      area_name,
      landmark,
      address_id,
    } = req.body;

    if (
      !address_id ||
      !full_name ||
      !phone_number ||
      !pincode ||
      !state ||
      !city ||
      !building_name ||
      !area_name ||
      !landmark
    ) {
      return res.send({
        result: false,
        message: language.insufficient_parameters,
      });
    }

    let CheckUser = await model.CheckUserQuery(req.headers.user_id);
    if (CheckUser.length > 0) {
      await model.UpdateAddressQuery(
        full_name,
        phone_number,
        alt_phone_number,
        pincode,
        state,
        city,
        building_name,
        area_name,
        landmark,
        req.headers.user_id,
        address_id
      );

      return res.send({
        result: true,
        message: language.address_successfully_updated,
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
