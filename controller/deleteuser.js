var model = require('../model/deleteuser')
var { languages } = require('../languages/languageFunc');
 
module.exports.DeleteUser = async(req,res)=>{
    try {
        var lang = req.body.language;
        var language = await languages(lang);
        var user_id = req.headers.user_id;
        var Id = req.body.Id;
        let checkadmin = await model.CheckAdmin(user_id);
        if(checkadmin.length > 0){
            let checkuser = await model.CheckUser(Id);
            console.log(checkuser);
            if(checkuser.length > 0){
                let userdelete = await model.UserDelete(Id)
                return res.send({
                    result:true,
                    message:language.User_removed_successfully
                })
            }else{
                return res.send({
                    result:false,
                    message:language.user_does_not_exist
                })
            }
            }
        else{
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