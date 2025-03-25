var model = require("../model/cartcount");
var {languages} = require("../languages/languageFunc");
const { WishlistCount } = require("./wishlistcount");

module.exports.CartCount = async(req,res) => {
    try {
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        var user_id = req.body.user_id;
        let checkuser = await model.CheckUser(user_id);
        if(checkuser.length > 0 ){
            let checkcart = await model.CheckCart(user_id);
            let checkwhishlist = await model.Checkwhishlist(user_id);
          return res.send({
            result:true,
            cartcount:checkcart.length,
            wishlistcount:checkwhishlist.length
          })
        }else{
            return res.send({
                result:false,
                message:language.user_does_not_exist
            })
        }
    } catch (error) {
        return res.send({
            result:false,
            message:error.message
        })
    }
};