var model = require("../model/AddAddress");
var { languages } = require("../languages/languageFunc");

module.exports.AddAddresses = async (req, res) => {
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
    } = req.body;

    if (
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
      let Addaddress = await model.AddAddressQuery(
        full_name,
        phone_number,
        alt_phone_number,
        pincode,
        state,
        city,
        building_name,
        area_name,
        landmark,
        req.headers.user_id
      );
      let SetAddress = await model.setAddress(Addaddress.insertId, req.headers.user_id);
      return res.send({
        result: true,
        message: language.address_successfully_added,
        address_id: Addaddress.insertId
      });
    } else {
      return res.send({
        result: false,
        message: language.user_does_not_exist,
      });
    }

  } catch (error) {
    console.log(error);
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
