var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);
var moment = require("moment");
var nodemailer = require("nodemailer");


module.exports.RazorpayCallback = async (req, res) => {
    let payment_id = req.query.razorpay_payment_id
    var order_id = req.query.order_id
    let updateOrder = await UpdateOrderChnge(payment_id, order_id)
    let UpdatePayment = await UpdatePaymentChnge(order_id)

    var date = moment().format("YYYY-MM-DD");


    var getorderdetails = await GetOrderDetails(order_id)
    var user_id = getorderdetails[0]?.user_id
    var address_id = getorderdetails[0]?.address_id

    if (getorderdetails.length > 0) {
        var CheckUser = await CheckUserQuery(user_id)
        var getaddress = await GetAddress(address_id)

        var tablehtml = ''
        var orderproductdetails = await GetOrderProductDetails(order_id)
        for (const element of orderproductdetails) {
            var getproduct = await GetProduct(element.order_product_product_id)

            // console.log(checkproduct);
            if (getproduct.length > 0) {

                tablehtml += '<tr>' +
                    '<td>' + getproduct[0]?.product_name + '</td>' +
                    '<td>' + getproduct[0]?.price + '</td>' +
                    '<td>' + element.order_product_quantity + '</td>' +
                    '<td>' + element.order_product_unit + '</td>' +
                    '<td>' + (parseFloat(getproduct[0]?.price) * parseFloat(element.order_product_quantity)) + '</td>' +
                    '</tr>';

            } else {
                return res.send({
                    result: false,
                    message: "product not found"
                })
            }
        };
    }



    let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 587,
        auth: {
            type: 'custom',
            method: 'PLAIN',
            user: 'noreply@kdpdwct.org',
            pass: 'noreply@Kdpdwct2024',
        },
    });

    let data = [{
        email: ` ${CheckUser[0]?.user_email}`,
        subject: "BHAKSHANAGAL ORDER CONFIRMED",
        html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cash on Delivery Details</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: auto;
            }
            h1 {
                color: #333;
                text-align: center;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
            }
            th {
                background-color: #007bff;
                color: white;
            }
            tr:hover {
                background-color: #f1f1f1;
            }
            .deleveryfee{
                color:red;
                font-size:13px;
            }
            .total {
                font-weight: bold;
                font-size: 1.2em;
                text-align: right;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 0.9em;
                color: #555;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Thank You for Your Order, ${CheckUser[0]?.user_name}!</h1>
            <p>We are happy to inform you that your order has been successfully added and is now being processed. Here are the details of your order:</p>
    
            <p><strong>Order Date:</strong> ${date}</p>
            <p><strong>Delivery Address:</strong> </p>
            <p>${getaddress[0]?.address_fullname},</p >
            <p>${getaddress[0]?.address_building_name},</p >
            <p>${getaddress[0]?.address_state},${getaddress[0]?.address_city},</p >
            <p>${getaddress[0]?.address_area_name},${getaddress[0]?.address_landmark},</p >
            <p>${getaddress[0]?.address_pincode}</p >
            <p>Ph.No:${getaddress[0]?.address_phone_number}</p>
            <h2>Products Details:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Product Amount</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                       ${tablehtml}
                    <tr>
                        <td class="total" colspan="4">Total Amount:</td>
                        <td class="total">${getorderdetails[0]?.order_amount}</td>
                    </tr>
                </tbody>
            </table>
            <p>If you have any questions or need further assistance, feel free to reach out to us.</p>
    
            <div class="footer">
                <p>Thank you for shopping with us!</p>
                <p>BHAKSHANAGAL</p>
        </div>
    </body>
    </html>
    `
    },
    {
        email: 'jaisonlunar701@gmail.com',
        subject: `BHAKSHANAGAL ORDER FROM : ${CheckUser[0]?.user_name}`,
        html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: auto;
            }
            h1 {
                color: #333;
            }
            p {
                color: #555;
            }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
            }
            th {
                background-color: #007bff;
                color: white;
            }
            tr:hover {
                background-color: #f1f1f1;
            }
            .deleveryfee{
                color:red;
                font-size:13px;
            }
            .total {
                font-weight: bold;
                font-size: 1.2em;
                text-align: right;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 0.9em;
                color: #555;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>New Order Received </h1>
            <p><strong>Customer Name:</strong> ${CheckUser[0]?.user_name}</p>
            <p><strong>Order Date:</strong> ${date}</p>
            <p><strong>Payment Method:</strong> Online</p>
            <p><strong>Customer Email:</strong> ${CheckUser[0]?.user_email}</p>
            <p><strong>Shipping Address:</strong></p>
            <p>${getaddress[0]?.address_fullname},</p >
            <p>${getaddress[0]?.address_building_name},</p >
            <p>${getaddress[0]?.address_state},${getaddress[0]?.address_city},</p >
            <p>${getaddress[0]?.address_area_name},${getaddress[0]?.address_landmark},</p >
            <p>${getaddress[0]?.address_pincode}</p >
            <p>Ph.No:${getaddress[0]?.address_phone_number}</p>
    
            <h2>Product Details:</h2>
                   <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Product Amount</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                       ${tablehtml}
                    <tr>
                        <td class="total" colspan="4">Total Amount:</td>
                        <td class="total">${getorderdetails[0]?.order_amount}</td>
                    </tr>
                </tbody>
            </table>
            <p>Please review the order details and proceed with the necessary processing and fulfillment.</p>
    
            <div class="footer">
                <p>Thank you!</p>
                <p>BHAKSHANAGAL</p>
            </div>
        </div>
    </body>
    </html>
    `
    }]


    data.forEach(async (el) => {
        let infos = await transporter.sendMail({
            from: "BHAKSHANAGAL <noreply@kdpdwct.org>",
            to: el.email,
            subject: el.subject,
            html: el.html
        });
        nodemailer.getTestMessageUrl(infos);

    });
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
    var data = await query(Query, ['confirmed', order_id]);
    return data;
};

async function GetOrderDetails(user_id) {
    var Query = `select * from bh_order_details where order_id = ?`;
    var data = query(Query, [user_id]);
    return data;
}

async function CheckUserQuery(user_id) {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
}

async function GetAddress(address_id) {
    var Query = `select * from bh_address where address_id = ?`;
    var data = query(Query, [address_id]);
    return data;
}

async function GetProduct(product_id) {
    var Query = `SELECT * FROM bh_products AS p
INNER JOIN bh_product_translations AS pt 
    ON p.product_id = pt.product_id
INNER JOIN bh_product_prices AS pp
    ON p.product_id = pp.product_id
WHERE p.product_id = ? 
    AND pt.language_id = 0 `;
    var data = query(Query, [product_id]);
    return data;
}

async function GetOrderProductDetails(order_id) {
    var Query = `select * from bh_order_product where order_product_order_id = ?`;
    var data = query(Query, [order_id]);
    return data;
}