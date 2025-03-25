const Razorpay = require("razorpay");
var crypto = require("crypto");

module.exports.VerifyOrder = async (req, res) => {
  const { order_id, payment_id } = req.body;
  const razorpay_signature = req.headers["x-razorpay-signature"];

  // Pass yours key_secret here
  const key_secret = "kfgWiehDgGyeG7iuFeUwbR5u";

  // STEP 8: Verification & Send Response to User

  // Creating hmac object
  let hmac = crypto.createHmac("sha256", key_secret);

  // Passing the data to be hashed
  hmac.update(order_id + "|" + payment_id);

  // Creating the hmac in the required format
  const generated_signature = hmac.digest("hex");

  if (razorpay_signature === generated_signature) {
    return res.send({ result: true, message: "Payment has been verified" });
  } else
    return res.send({ result: false, message: "Payment verification failed" });
};
