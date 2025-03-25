var model = require("../model/wishlistcount");
var {languages} = require("../languages/languageFunc");

module.exports.WishlistCount = async(req,res) => {
    try {
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        var user_id = req.body.user_id;
        let checkuser = await model.CheckUser(user_id);
        if(checkuser.length > 0){
            let checkwhishlist = await model.CheckWishlist(user_id);
            return res.send({
                result:true,
                WishlistCount:checkwhishlist.length
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
}