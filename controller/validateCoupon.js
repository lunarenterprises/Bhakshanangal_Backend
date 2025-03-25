var model = require("../model/validateCoupon");
var { languages } = require("../languages/languageFunc");
const { log } = require("util");
var moment = require("moment");

module.exports.ValidateCoupon = async (req, res) => {
  try {
    var lang = req.body.language;
    var language = await languages(lang);
    var coupon_code = req.body.coupon_code;
    var amount = req.body.amount;
    var current_date = moment().format("YYYY-MM-DD");
    let CheckUser = await model.CheckUserQuery(req.headers.user_id);
    console.log(CheckUser.length, "is it working??");
    if (CheckUser.length > 0) {
      let checkcoupon = await model.CheckCoupon(coupon_code, current_date);
      console.log(checkcoupon, "checkcoupon");
      if (checkcoupon.length > 0) {
        let discount = Number(amount) * Number(checkcoupon[0].coupon_discount) / 100
        let discount_amount = Number(amount) - discount
        return res.send({
          result: true,
          message: language.coupon_is_valid,
          amount: discount_amount
        });
      } else {
        return res.send({
          result: false,
          message: language.coupon_is_not_valid,
          amount: amount
        });
      }
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
