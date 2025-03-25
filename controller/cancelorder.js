var model = require("../model/cancelorder");
var { languages } = require("../languages/languageFunc");
var Razorpay = require('razorpay')
const randtoken = require('rand-token');
var axios = require('axios')

module.exports.CancelOrder = async (req, res) => {
    try {
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        var user_id = req.headers.user_id;
        var order_id = req.body.order_id;
        let checkuser = await model.CheckUser(user_id);
        if (checkuser.length > 0) {
            let checkorder = await model.CheckOrder(order_id, user_id);
            if (checkorder.length > 0) {
                if (checkorder[0].order_payment_method !== 'cod') {
                    var paymentId = checkorder[0].payment_id; // Replace PAYMENT_ID with the actual payment ID
                    let key_id = "rzp_test_4JJAaipsPAqRRJ"
                    let key_secret = "Gw6kdV3PCewFzn9kpvWU5zJH"
                    var requestData = {
                        "amount": Number(checkorder[0].order_amount) * 100,
                        "speed": "optimum",
                        "receipt": "Receipt No." + " " + generateOrderId()
                    }
                    var authHeader = {
                        auth: {
                            username: key_id,
                            password: key_secret,
                        },
                    };

                    axios.post(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, requestData, authHeader)
                        .then(async response => {
                            let removeorder = await model.RemoveOrder(order_id);

                            console.log('Refund successful:', response.data);
                            res.send({
                                result: true,
                                message: response.data
                            })
                        })
                        .catch(error => {

                            console.error(error.response.data.error.description);
                            res.send({
                                result: false,
                                message: error.response ? error.response.data.error.description : error.message
                            })

                        });
                } else {
                    let removeorder = await model.RemoveOrder(order_id);
                       res.send({
                                result: true,
                                message: "order cancelled successfully"
                            })
                }
                console.log("in here", checkorder[0].order_payment_method);

            } else {
                return res.send({
                    result: false,
                    message: language.Order_not_found
                })
            }
        } else {
            return res.send({
                result: false,
                message: language.User_not_found
            })
        }
    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message
        })
    }
};

const generateOrderId = () => {
    return randtoken.generate(4, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
};
