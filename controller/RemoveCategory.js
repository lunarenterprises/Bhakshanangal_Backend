var model = require('../model/RemoveCategory')
var { languages } = require('../languages/languageFunc');

module.exports.RemoveCategory = async(req,res)=>{
    let {category_id} = req.body
    var lang = req.body.language;
    var language = await languages(lang);
if(!category_name){
    return res.send({
        result: false,
        message: language.insufficient_parameters,
      });
}
    let CheckAdmin = await model.CheckAdminQuery(req.headers.user_id)
    if(CheckAdmin.length > 0 ){
        let CheckCategory = await model.Getcategory(category_id)
        if(CheckCategory.length > 0){
            await model.RemoveCategory(category_id)
            return res.send({
                result:true,
                message:language.category_deleted_success
            })
           
        }else{
            return res.send({
                result:false,
                message:language.category_not_found
            })
        }
    }else{
        return res.send({
            result:false,
            message:language.Try_with_admin_level_Account
        })
    }

}
