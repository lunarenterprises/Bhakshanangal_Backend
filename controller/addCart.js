var model = require("../model/addCart");
var { languages } = require("../languages/languageFunc");

module.exports.addCart = async (req, res) => {
  try {
    var lang = req.body.language;
    var language = await languages(lang);
    let { product_id, quantity, unit } = req.body;
    let quantities = quantity ? quantity : 1
    let user_id = req.headers.user_id;
    var checkUser = await model.checkUser(user_id);
    var checkProducts = true;
    if (checkUser.length > 0) {
      let checkProduct = await model.checkProduct(product_id, language)
      if (checkProduct.length == 0) {
        return res.send({
          result: false,
          message: language.product_stock_not_available
        })
      } else {
        let checkingProductInCart = await model.checkProductInCart(product_id, user_id)
        if (checkingProductInCart.length == 0) {
          let AddingproductIncart = await model.AddingCart(product_id, user_id, quantities, unit)

        } else {
          await model.UpdateProductInCart(product_id, user_id, quantities, unit)
        }
        return res.send({
          result: true,
          message: language.cart_added_successfully
        })
      }

    } else {
      return res.send({ result: false, message: language.user_does_not_exist });
    }
  } catch (error) {
    console.log(error);
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
