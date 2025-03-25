var model = require('../model/dashboard_product_cart')
var { languages } = require("../languages/languageFunc");
var moment = require('moment')

module.exports.DashboardProductsCart = async (req, res) => {
    try {
        let { view } = req.body
        var lang = req.body.language || 'en';
        var language = await languages(lang);
        // if (!view) {
        //     return res.send({
        //         result: false,
        //         message: language.insufficient_parameters
        //     })
        // }
        var current_date = moment().format('YYYY-MM-DD')
        let past_date = moment().subtract(7, 'days').format('YYYY-MM-DD')
        let condition = ``
        if (view == 'month') {
            condition = `and YEAR(created_at) = YEAR('${current_date}') AND MONTH(created_at) = MONTH('${current_date}')`
        } else if (view == 'week') {
            condition = `AND created_at BETWEEN '${past_date}' AND '${current_date}'`
        }
        let getOrders = await model.Getorder(condition)
        let datas = await Promise.all(getOrders.map(async (element) => {
            let products = await model.productList(lang, element.product_id);
            // console.log(products,"products");
            if(products.length > 0){
                element.product_name =products[0].product_name
            }
            return element
        }))
        console.log(datas);
        if (datas.length > 0) {
            var productCounts = {};
            datas.forEach(element => {
                var productName = element.product_name;

                if (!productCounts[productName]) {
                    productCounts[productName] = {
                        confirmed: 0,
                        cancelled: 0,
                        packed: 0,
                        shipped: 0,
                        delivered: 0,
                        pending: 0,
                        returned:0
                    };
                }

                if (element.order_status === 'confirmed') {
                    productCounts[productName].confirmed++;
                } else if (element.order_status === 'cancelled') {
                    productCounts[productName].cancelled++;
                } else if (element.order_status === 'packed') {
                    productCounts[productName].packed++;
                } else if (element.order_status === 'shipped') {
                    productCounts[productName].shipped++;
                } else if (element.order_status === 'delivered') {
                    productCounts[productName].delivered++;
                } else if (element.order_status === 'pending') {
                    productCounts[productName].pending++;
                }else if (element.order_status === 'returned') {
                    productCounts[productName].returned++;
                }
            });
            var dataArray = Object.entries(productCounts).map(([productName, statusObj]) => ({
                productName,
                ...statusObj
            }));
            return res.send({
                result: true,
                message: language.data_retrieved,
                data: dataArray
            })
        } else {
            return res.send({
                result: false,
                message: language.data_not_found
            })
        }
    } catch (error) {
        console.log(error);
        res.send({
            result: false,
            message: error.message
        })
    }
}