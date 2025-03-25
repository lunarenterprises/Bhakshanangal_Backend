var model = require("../model/Wishlist");
var { languages } = require("../languages/languageFunc");

module.exports.AddWishlist = async (req, res) => {
  try {
    var lang = req.body.lang || "en";
    var language = await languages(lang);
    var wish = req.body.wish;
    var user_id = req.headers.user_id;
    var product_id = req.body.product_id;
    // var Id = req.body.Id;
    let checkuser = await model.CheckUser(user_id);
    if (checkuser.length > 0) {
      let checkproduct = await model.CheckProduct(product_id);
      if (checkproduct.length > 0) {
        let checkwish = await model.CheckWish(product_id, user_id);
        if (checkwish.length > 0) {
          if (wish == 0) {
            console.log("in here");
            let removewish = await model.RemoveWish(product_id, user_id);
            return res.send({
              result: true,
              message: language.Product_removed_from_wishlist,
            });
          } else {
            console.log("in here 2");
            return res.send({
              result: false,
              message: language.Product_already_in_wishlist,
            });
          }
        } else {
          if (wish == 0) {
            return res.send({
              result: true,
              message: language.Product_already_removed_wishlist,
            });
          } else {
            let addwish = await model.AddWish(product_id, user_id);
            return res.send({
              result: true,
              message: language.Product_added_to_wishlist,
            });
          }
        }
      } else {
        return res.send({
          result: false,
          message: language.Product_not_found,
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
