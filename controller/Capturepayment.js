// const Razorpay = require("razorpay");
// const { languages } = require("../languages/languageFunc");

// module.exports.capturePayment = async (req, res) => {
//   var lang = req.body.language || "en";
//   var language = await languages(lang);

//   const razorpayInstance = new Razorpay({
//     key_id: "rzp_test_az7fEZxXoBzThm",
//     key_secret: "kfgWiehDgGyeG7iuFeUwbR5u",
//   });

//   try {
//     let { amount, currency } = req.query;
//     amount = amount * 100   

//     let capturedPayment = await razorpayInstance.payments.capture(
//       paymentId,
//       amount,
//       currency
//     );
//     return res.send({
//       result: true,
//       message: language.Payment_captured_success,
//       data: capturedPayment,
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// };
