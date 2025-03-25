var model = require("../model/productdropdown");
var { languages } = require("../languages/languageFunc");

module.exports.DropDown = async(req,res) => {
    try {
        var lang = req.body.lang || 'en';
        var language = await languages(lang);
        var user_id = req.headers.user_id;
        let search = req.body.search
        // let checkadmin = await model.CheckAdmin(user_id);
  
            let condition = "";
            if (search) {
                condition = ` and product_name like '${search}%'`
              }
            let getproduct = await model.GetProduct(lang,condition);
            if(getproduct.length > 0 ){
                return res.send({
                    result: true,
                    message:language.data_retrieved,
                    list:getproduct
                })
            }else{
                return res.send({
                    result:false,
                    message:language.data_not_found
                })
            }
    
    } catch (error) {
        return res.send({
            result:false,
            message:error.message
        })
    }
}