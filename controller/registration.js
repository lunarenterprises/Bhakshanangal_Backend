var model = require("../model/registration");
var { languages } = require("../languages/languageFunc");
var nodemailer = require("nodemailer");
var randtoken = require("rand-token").generator({
  chars: "0123456789",
});
var bcrypt = require("bcrypt");

module.exports.Regsiter = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    var lang = req.body.language;
    var language = await languages(lang);
    if (!name || !email || !password) {
      return res.send({
        result: false,
        message: language.insufficient_parameters,
      });
    }

    let CheckUser = await model.CheckUserQuery(email);
    var token = randtoken.generate(4);

    if (CheckUser.length > 0) {
      if (CheckUser[0].user_email_verification == "no") {
        var hashedPassword = await bcrypt.hash(password, 10);
        await model.UpdateUserQuery(name, email, hashedPassword);
        let CheckVerificationCode = await model.CheckVerificationQuery(
          CheckUser[0].user_id
        );
        if (CheckVerificationCode.length > 0) {
          await model.UpdateVerificationQuery(CheckUser[0].user_id, token);
        } else {
          await model.InsertVerificationQuery(CheckUser[0].user_id, token);
        }

        let transporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 587,
          auth: {
            type: 'custom',
            method: 'PLAIN',
            user: 'noreply@bhakshanangal.com',
            pass: 'noreplay@BH123',
          },
        });


        let data = [{
          email: email,
          subject: "Your single-use code",
          html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Single-Use Code</title>
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
                  .code {
                      display: inline-block;
                      padding: 10px 20px;
                      margin: 20px 0;
                      background-color: #28a745;
                      color: #fff;
                      font-size: 18px;
                      font-weight: bold;
                      border-radius: 5px;
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
                      <h1>Your Single-Use Code</h1>
                      <p>We received your request for a single-use code to use with your Bhakshanangal account.</p>
                      <p>Your single-use code is:</p>
                      <div class="code">${token}</div>
                      <p>If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
                      <a href="https://lunarsenterprises.com:3000/bhakshanangal/webverification?code=${token}&email=${email}" class="button">Verify Your Account</a>
                      <p>Thanks,<br>The Bhakshanangal Account Team</p>
                  </div>
                  <div class="footer">
                      <p>&copy; 2024 Bhakshanangal. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>`,
        }];
        // console.log('hai');


        data.forEach(async (el) => {
          let infos = await transporter.sendMail({
            from: "BHAKSHANAGAL <noreply@bhakshanangal.com>",
            to: el.email,
            subject: el.subject,
            html: el.html
          });
          nodemailer.getTestMessageUrl(infos);

        });

        return res.send({
          status: true,
          message: language.verification_code_sent_to_ur_mail,
        });
      } else {
        return res.send({
          result: false,
          message: language.email_already_registered,
        });
      }
    } else {
      var hashedPassword = await bcrypt.hash(password, 10);
      var InsertUser = await model.InsertUserQuery(name, email, hashedPassword);
      await model.InsertVerificationQuery(InsertUser.insertId, token);

      let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 587,
        auth: {
          type: 'custom',
          method: 'PLAIN',
          user: 'noreply@bhakshanangal.com',
          pass: 'noreplay@BH123',
        },
      });

      let data = [{
        email: email,
        subject: "Your single-use code",
        html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Single-Use Code</title>
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
                  .code {
                      display: inline-block;
                      padding: 10px 20px;
                      margin: 20px 0;
                      background-color: #28a745;
                      color: #fff;
                      font-size: 18px;
                      font-weight: bold;
                      border-radius: 5px;
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
                      <h1>Your Single-Use Code</h1>
                      <p>We received your request for a single-use code to use with your Bhakshanangal account.</p>
                      <p>Your single-use code is:</p>
                      <div class="code">${token}</div>
                      <p>If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
                      <a href="https://lunarsenterprises.com:3000/bhakshanangal/webverification?code=${token}&email=${email}" class="button">Verify Your Account</a>
                      <p>Thanks,<br>The Bhakshanangal Account Team</p>
                  </div>
                  <div class="footer">
                      <p>&copy; 2024 Bhakshanangal. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>`,
      }];

      data.forEach(async (el) => {
        let infos = await transporter.sendMail({
          from: "BHAKSHANAGAL <noreply@bhakshanangal.com>",
          to: el.email,
          subject: el.subject,
          html: el.html
        });
        nodemailer.getTestMessageUrl(infos);

      });

      return res.send({
        status: true,
        message: language.verification_code_sent_to_ur_mail,
      });
    }
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
