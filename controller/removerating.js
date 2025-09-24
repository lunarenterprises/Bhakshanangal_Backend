var model = require("../model/removerating");
var {languages} = require("../languages/languageFunc");

module.exports.RemoveRating = async(req,res) => {
    try {
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        const { user_id } = req?.user || req?.headers
        var rating_id = req.body.rating_id;
        let checkuser = await model.CheckUser(user_id)
        if(checkuser.length > 0){
            let checkrating = await model.CheckRating(rating_id);
            if(checkrating.length > 0){
                let removerating = await model.RemoveRating(rating_id);
                return res.send({
                    result:true,
                    message:language.Rating_removed_successfully
                })
            }else{
                return res.send({
                    result:false,
                    message:language.Rating_does_not_exists
                })
            }
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