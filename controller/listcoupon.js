var model = require("../model/listcoupon");
var {languages} =require("../languages/languageFunc");
var moment = require("moment")

module.exports.ListCoupon = async(req,res) => {
    try {
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        var user_id = req.headers.user_id;
        // var coupon_code = req.body.coupon_code;
        var current_date = moment().format("YYYY-MM-DD");
        // let checkadmin = await model.CheckAdmin(user_id);
            let listcoupon = await model.ListCoupon();
            if(listcoupon.length > 0){
                return res.send({
                    result:true,
                    message:language.data_retrieved,
                    couponlist:listcoupon
                })
            }else{
                return res.send({
                    result:false,
                    message:language.Coupon_code_not_valid
                })
            }
    } catch (error) {
        return res.send({
            result:false,
            message:error.message
        })
    }
};