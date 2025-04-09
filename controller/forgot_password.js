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
        service: "Gmail",
        auth: {
          user: "noreply@bhakshanangal.com",
          pass: "noreplay@BH123",
        },
      });
      console.log("haiiiii", token);
      let info = await transporter.sendMail({
        from: "contact@bhakshanangal.com",
        to: email,
        subject: "Your single-use code",
        text: `
                We received your request for a single-use code to use with your Bhakshanangal account.
              
                Your single-use code is: ${token}
              
                If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.
              
                Thanks,
                Bhakshanangal account team
              `,
      });
      // console.log('hai');
      nodemailer.getTestMessageUrl(info);
      console.log(info);
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
