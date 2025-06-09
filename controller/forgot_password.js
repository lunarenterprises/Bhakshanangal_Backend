var model = require("../model/forgot_password");
var { languages } = require("../languages/languageFunc");
var nodemailer = require("nodemailer");
var randtoken = require("rand-token").generator({
  chars: "0123456789",
});

module.exports.ForgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    var lang = req.body.language;
    var language = await languages(lang);
    if (!email) {
      return res.send({
        result: false,
        message: language.insufficient_parameters,
      });
    }
    let CheckUser = await model.CheckUserQuery(email);
    var token = randtoken.generate(4);

    if (CheckUser.length > 0) {
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
          user: "noreply@bhakshanangal.com",
          pass: "Bhkl@123",
        },
      });
      // console.log("haiiiii", token);
      let data = [{
        email: email,
        subject: "Your single-use code",
        html: ` <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Forgot Password</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <table width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #4a90e2; padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0;">Reset Your Password</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p>Hi there,</p>
              <p>We received a request to reset your password. Use the OTP below to proceed:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; padding: 15px 30px; background-color: #f0f0f0; font-size: 24px; letter-spacing: 4px; border-radius: 5px; font-weight: bold;">
                  ${token}
                </span>
              </div>
              <p>If you didn’t request this, please ignore this email.</p>
              <p>Thanks,<br>THE BHAKSHANAGAL TEAM</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #eeeeee; text-align: center; padding: 20px; font-size: 12px; color: #666;">
              © 2025 Your Company. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
 `
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
        message: language.email_not_registered,
      });
    }
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
