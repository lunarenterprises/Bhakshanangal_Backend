var model = require('../model/google_register')
var { languages } = require("../languages/languageFunc");

module.exports.GoogleRegister = async(req,res)=>{
    var { name, email} = req.body
    var lang = req.body.language;
    var language = await languages(lang);
    if (!name || !email) {
      return res.send({
        result: false,
        message: language.insufficient_parameters,
      });
    }
    let CheckUser = await model.CheckUserQuery(email);
    if(CheckUser.length > 0){
        return res.send({
            result: false,
            message: language.email_already_registered,
        })
    }else{
        var InsertUser = await model.InsertUserQuery(name, email);
        console.log(InsertUser.insertId);
        return res.send({
            status: true,
            message: language.user_registered_successfully
          });
    }

}