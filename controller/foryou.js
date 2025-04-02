var model = require("../model/foryou");
var { languages } = require("../languages/languageFunc");


module.exports.ForYou = async (req, res) => {
    try {
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        var user_id = req.headers.user_id;
        var page_no = req.body.page_no ? Number(req.body.page_no) : 1
        var limit = req.body.limit ? req.body.limit : 10
        var starting_offset = (limit * page_no) - limit;
        // console.log(starting_offset, "starting_offset", limit, page_no);
        var ending_offset = limit * page_no
        // var product_id = req.body.product_id;
        let checkuser = await model.CheckUser(user_id);
        if (checkuser.length > 0) {
            let listproduct = await model.ListProducts([user_id]);
            // console.log(listproduct);
            if (listproduct.length > 0) {
                let product_id = listproduct.map(element => {
                    return element.wish_product_id
                })
                // console.log(product_id);
                let getcategory = await model.GetCategory(product_id)
                // console.log(getcategory);
                let category_id = getcategory.map(element => {
                    return element.category_id
                })
                // console.log(category_id);
                let GetProduct = await model.GetProducts(lang, category_id, limit, starting_offset);
                GetProduct.forEach(element => {
                    element.image_file = element.image_file
                });
                let totalData = await model.GetProducts1(lang, category_id)

                // console.log(GetProduct, "GetProduct");
                if (GetProduct.length > 0) {
                    return res.send({
                        result: true,
                        message: language.data_retrieved,
                        list: GetProduct,
                        current_data_count: GetProduct.length,
                        total_data_count: totalData.length,
                    })
                } else {
                    return res.send({
                        result: false,
                        message: language.data_not_found
                    })
                }
            } else {
                return res.send({
                    result: false,
                    message: language.Product_not_found
                })
            }
        } else {
            return res.send({
                result: false,
                message: language.User_not_found
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
};