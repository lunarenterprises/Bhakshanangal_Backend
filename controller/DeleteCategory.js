var model = require("../model/DeleteCategory");
var { languages } = require("../languages/languageFunc");

module.exports.DeleteCategory = async (req, res) => {
    try {
        var lang = req.body.language;
        var language = await languages(lang);
        let { category_id } = req.body;
        if (!category_id) {
            return res.send({
                reruls: false,
                message: "Category id is required"
            })
        }
        let { user_id } = req.headers;
        if (!user_id) {
            return res.send({
                result: false,
                message: "user id is required"
            })
        }
        let checkUser = await model.CheckUser(user_id);
        if(checkUser.affectedRows>0){
            return res.send({
                result:true,
                message:"Category deleted successfully"
            })
        }else{
            return res.send({
                result:false,
                message:"Failed to delete category"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
};
