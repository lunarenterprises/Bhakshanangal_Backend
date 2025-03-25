var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.RazorpayCallback = async (req, res) => {
    let payment_id = req.query.razorpay_payment_id
    let order_id = req.query.order_id
    let updateOrder = await UpdateOrderChnge(payment_id, order_id)
    let UpdatePayment = await UpdatePaymentChnge(order_id)
    return res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Successful</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
    
            .container {
                background-color: #fff;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
    
            h1 {
                color: #27ae60;
                margin-bottom: 20px;
            }
    
            p {
                color: #333;
                margin-bottom: 30px;
            }
    
            .button {
                background-color: #27ae60;
                color: #fff;
                padding: 10px 20px;
                border-radius: 5px;
                text-decoration: none;
                transition: background-color 0.3s ease;
            }
    
            .button:hover {
                background-color: #219653;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Payment Successful</h1>
            <p>Your payment was successful. Thank you for your purchase!</p>
            <a href="https://bhakshanangal.com/home" class="button">Back to Home</a>
        </div>
    </body>
    </html>
    `)


}

async function UpdateOrderChnge(payment_id, order_id) {
    var Query = `update bh_order_details set payment_id = ? , order_status = ? where order_id = ?`;
    var data = await query(Query, [payment_id, 'confirmed', order_id]);
    return data;
};

async function UpdatePaymentChnge(order_id) {
    var Query = `update bh_payment_details set status = ? where order_id = ?`;
    var data = await query(Query, [ 'confirmed', order_id]);
    return data;
};