var model = require("../model/deleteCart");
var { languages } = require("../languages/languageFunc");

module.exports. DeleteCart = async (req, res) => {
  try {
    var lang = req.body.language;
    var language = await languages(lang);
    let { cart_id } = req.body;
    let user_id = req.headers.user_id;
    var checkUser = await model.checkUser(user_id);
    var checkProducts = '';
    var message = language.product_stock_not_available
    if (checkUser.length > 0) {
      let checkingProductInCart = await model.checkProductInCart(user_id,cart_id)
      if (checkingProductInCart.length > 0) {
        let updatecart = await model.Updatecart(cart_id, user_id);
        console.log(updatecart,"lenkdgvkdhufgaehlfqwlj");
        if(updatecart.changedRows > 0 ){
        return res.send({
          result: true,
          message: language.item_removed_from_cart
        })
      }else{
        return res.send({
          result:false,
          message:language.item_already_removed
        })
      }
      } else {
        return res.send({
          result: false,
          message: language.cart_item_not_found
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
