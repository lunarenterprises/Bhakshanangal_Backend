var model = require("../model/order_delivery_status_update");
var { languages } = require("../languages/languageFunc");
const nodemailer = require('nodemailer');

module.exports.UpdateDeliveryStatus = async (req, res) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 587,
            auth: {
                type: 'custom',
                method: 'PLAIN',
                user: 'info@bhakshanangal.com',
                pass: 'info123abcAB@',
            },
        });
        var lang = req.body.lang || "en";
        var language = await languages(lang);
        let user_id = req.headers.user_id
        let order_id = req.body.order_id
        let delivery_status = req.body.delivery_status
        let checkadmin = await model.CheckAdminQuery(user_id)
        if (checkadmin.length > 0) {
            let status_update = await model.updatedeliverystatusQuery(delivery_status, order_id)
            let checkdeliverymode = await model.getdeliverymode(delivery_status)
            console.log(checkdeliverymode[0].delivery_mode_status, "checkdeliverymode[0].delivery_mode_status");
            let result = await CheckHtml(checkdeliverymode[0].delivery_mode_status)

            const mailOptions = {
                from: '"Bhakshanangal"<info@bhakshanangal.com>',
                to: 'idhay.t.umesh@gmail.com',
                subject: result.subject,
                html: result.html,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending verification email:", error);
                    return res.status(500).json({ msg: "Failed to send verification email" });
                } else {
                    console.log("email sent:", info.response);
                    return res.send({
                        result: true,
                        message: language.order_updated_successfully,
                    })
                }
            });


        } else {
            return res.send({
                result: false,
                message: language.Try_with_admin_level_Account,
            });
        }




    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })
    }
}

async function CheckHtml(status) {
    if (status == 'order placed') {
        return {
            subject: "Order Confirmation",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Confirmation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                    }
                    .header img {
                        max-width: 150px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        font-size: 12px;
                        color: #777;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        margin-top: 20px;
                        background-color: #28a745;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://lunarsenterprises.com:3000/uploads/logo_bhakshanangal.jpg" alt="Bhakshanangal">
                    </div>
                    <div class="content">
                        <h1>Order Confirmation</h1>
                        <p>Thank you for your order! Your order has been placed successfully.</p>
                        <p>We will notify you once your order has been shipped.</p>
                        For more shopping,<br><a href="https://www.bhakshanangal.com/home" class="button"> click here</a>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Bhakshanangal. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>`
        }

    } else if (status == "order packed") {
        return {
            subject: "Order Packed",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Packed</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                    }
                    .header img {
                        max-width: 150px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        font-size: 12px;
                        color: #777;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        margin-top: 20px;
                        background-color: #28a745;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://lunarsenterprises.com:3000/uploads/logo_bhakshanangal.jpg" alt="Bhakshanangal">
                    </div>
                    <div class="content">
                        <h1>Order Packed</h1>
                        <p>We are pleased to inform you that your order has been packed and is ready for shipment.</p>
                        <p>You will receive another notification once your order has been shipped.</p>
                        For more shopping,<br><a href="https://www.bhakshanangal.com/home" class="button"> click here</a>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Bhakshanangal. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html> `
        }
    } else if (status == 'order shipped') {
        return {
            subject: "Order Shipped",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Shipped</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f7f7f7;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .logo {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .logo img {
                        max-width: 150px;
                    }
                    h1 {
                        color: #4CAF50;
                    }
                    p {
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">
                        <img src="https://lunarsenterprises.com:3000/uploads/logo_bhakshanangal.jpg" alt="Company Logo">
                    </div>
                    <h1>Your Order has Shipped!</h1>
                    <p>We are pleased to inform you that your order has been shipped. You will receive another update once your order has been delivered. If you have any questions, feel free to contact us at <a href="mailto:support@bhakshanangal.com">support@bhakshanangal.com</a>.</p>
            
                    <p>Thank you for shopping with us!</p>
            
                    <p>Best regards,<br>The Bhakshanangal Team</p>
                </div>
            </body>
            </html>
            `
        }
    } else if (status == 'order delivered') {
        return {
            subject: "Order Delivered",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Delivered</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f7f7f7;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .logo {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .logo img {
                        max-width: 150px;
                    }
                    h1 {
                        color: #4CAF50;
                    }
                    p {
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">
                        <img src="https://lunarsenterprises.com:3000/uploads/logo_bhakshanangal.jpg" alt="Company Logo">
                    </div>
                    <h1>Your Order has been Delivered!</h1>
                    <p>We are delighted to inform you that your order has been successfully delivered. We hope you enjoy your purchase!</p>
            
                    <p>If you have any questions or concerns about your order, please do not hesitate to contact us at <a href="mailto:support@bhakshanangal.com">support@bhakshanangal.com</a>.</p>
            
                    <p>Thank you for shopping with us!</p>
            
                    <p>Best regards,<br>The Bhakshanangal Team</p>
                </div>
            </body>
            </html>
            `
        }
    }
}