var model = require('../model/removecoupon');
var {languages} = require("../languages/languageFunc");


module.exports.RemoveCoupon = async(req,res) =>{
    try {
        var user_id = req.headers.user_id;
        var coupon_id = req.body.coupon_id;
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        let checkadmin = await model.CheckAdmin(user_id);
        if(checkadmin.length > 0 ){
            let checkcoupon = await model.CheckCoupon(coupon_id);
            if(checkcoupon.length > 0 ){
                let removecoupon = await model.RemoveCoupon(coupon_id);
                return res.send({
                    result:true,
                    message:language.coupon_removed_successfully
                })
            }else{
                return res.send({
                    result:false,
                    message:language.coupon_not_found
                })
            }
        }else{
            return res.send({
                result:false,
                message:language.Try_with_admin_level_Account
            })
        }
    } catch (error) {
        return res.send({
            result:false,
            message:error.message
        })
    }
};