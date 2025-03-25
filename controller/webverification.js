var model = require("../model/verification");
var { languages } = require("../languages/languageFunc");
var moment = require('moment')

module.exports.WebVerification = async (req, res) => {
    try {
        let { email, code } = req.query;
        var lang = req.body.language;
        var language = await languages(lang);
        if (!email || !code) {
            return res.send({
                result: false,
                message: language.insufficient_parameters,
            });
        }
        let CheckUser = await model.CheckUserQuery(email);
        if (CheckUser.length > 0) {
            let CheckVerificationCode = await model.CheckVerificationQuery(
                CheckUser[0].user_id,
                parseInt(code)
            );

            if (CheckVerificationCode.length > 0) {
                var date = moment().format("YYYY-MM-DD")
                await model.UpdateUserinfoQuery(CheckUser[0].user_id, date)
                return res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Verified Successfully</title>
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
                    text-align: center;
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
                    background-color: #007bff;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://bhakshanangal.com/logo/blacklogo.jpg" alt="Bhakshanangal">
                </div>
                <div class="content">
                    <h1>Account Verified Successfully</h1>
                    <p>Congratulations! Your account has been successfully verified.</p>
                    <a href="https://www.bhakshanangal.com/signin" class="button">Continue to login</a>
                    <p>Thank you for verifying your account. We hope you enjoy your experience with Bhakshanangal.</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Bhakshanangal. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `);
            } else {
                return res.send(`<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Account Verification Failed</title>
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
                            text-align: center;
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
                            background-color: #dc3545;
                            color: #fff;
                            text-decoration: none;
                            border-radius: 5px;
                            font-size: 16px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://bhakshanangal.com/logo/blacklogo.jpg" alt="Bhakshanangal">
                        </div>
                        <div class="content">
                            <h1>Account Verification Failed</h1>
                            <p>Unfortunately, we were unable to verify your account.</p>
                            <p>Please try signing up using another account.</p>
                            <a href="https://www.bhakshanangal.com/signin/signup" class="button">Sign Up Again</a>
                            <p>If you continue to experience issues, please contact our support team.</p>
                            <p>Thank you for your patience.<br>The Bhakshanangal Account Team</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Bhakshanangal. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                `);
            }
        } else {
            return res.send(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>User Not Found</title>
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
                        text-align: center;
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
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                        font-size: 16px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="https://bhakshanangal.com/logo/blacklogo.jpg" alt="Bhakshanangal">
                    </div>
                    <div class="content">
                        <h1>User Not Found</h1>
                        <p>Dear user,</p>
                        <p>We couldn't find your account in our system.</p>
                        <p>If you haven't signed up yet, please do so using the link below:</p>
                        <a href="https://www.bhakshanangal.com/signin/signup" class="button">Sign Up Now</a>
                        <p>If you believe this is a mistake or if you have any questions, feel free to contact our support team.</p>
                        <p>Thank you for your understanding.<br>The Bhakshanangal Team</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Bhakshanangal. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            `);
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message,
        });
    }
};
