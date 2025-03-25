var model = require('../model/dashboard')
var { languages } = require("../languages/languageFunc");
var moment = require('moment');

module.exports.Dashboard = async (req, res) => {
    try {
        let { } = req.body
        var lang = req.body.language || 'en';
        var language = await languages(lang);
        let user_id = req.headers.user_id
        var current_date = moment().format('YYYY-MM-DD')
        console.log(current_date, "date");
        let CheckAdminUser = await model.CheckAdminQuery(user_id)
        if (CheckAdminUser.length > 0) {
            // let GetUser = await model.Getuserlist();
            let Getproduct = await model.GetProducts(lang, current_date);
            let GetOrderdetails = await model.Orderlist(lang, current_date);
            let TopSelling = await model.SellingTop(lang, current_date)
            // console.log(TopSelling, 'whakhajsgdfouyasdgfadfgaskdjhfgaksdhfg');
        
            // console.log(GetOrderdetails);
            var productCounts = {};

            GetOrderdetails.forEach(element => {
                const productName = element.product_name;

                if (!productCounts[productName]) {
                    productCounts[productName] = {
                        confirmed: 0,
                        cancelled: 0,
                        packed: 0,
                        shipped: 0,
                        delivered: 0
                    };
                }

                if (element.order_status === 'confirmed') {
                    productCounts[productName].confirmed++;
                } else if (element.order_status === 'cancelled') {
                    productCounts[productName].cancelled++;
                } else if (element.order_status === 'packed') {
                    productCounts[productName].packed++;
                } else if (element.order_status === 'shipped') {
                    productCounts[productName].packed++;
                } else if (element.order_status === 'delivered') {
                    productCounts[productName].packed++;
                }
            });


            if(GetOrderdetails.length > 0){
                return res.send({
                    result: true,
                    message: language.data_retrieved,
                    product_count: Getproduct.length,
                    product_details: productCounts,
                    topselling: TopSelling
                })
            }else{
                return res.send({
                    result: false,
                    message: language.data_not_found
                })
            }
           
        } else {
            return res.send({
                result: false,
                message: language.Try_with_admin_level_Account
            })
        }

    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
}