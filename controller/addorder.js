var model = require("../model/addorder");
var { languages } = require('../languages/languageFunc')
var moment = require("moment");
const randtoken = require('rand-token');
var axios = require('axios')

module.exports.AddOrder = async (req, res) => {
  try {
    // let key_id = "rzp_test_7nzrvkrL9tTZ0I"
    // let key_secret = "ZRvJ0KBWEHoHd7RqSXReRsEd"
    let key_id = "rzp_live_rTIA0YO4qxlLxK"
    let key_secret = "3KVCpUQ0A4n636u2bSh8mvkO"

    var lang = req.body.lang || 'en';
    var language = await languages(lang);
    var payment_method = req.body.payment_method;
    var product_details = req.body.product_details;
    var user_id = req.headers.user_id;
    var gift_card = req.body.gift_card;
    var amount = req.body.amount
    var Order_id = generateOrderId();
    var address_id = req.body.address_id;

    let date = moment().format("YYYY-MM-DD");
    let delivery_date = moment(date, "YYYY-MM-DD").add(7, 'days').format("YYYY-MM-DD");
    let CheckUser = await model.CheckUserQuery(user_id);
    if (CheckUser.length > 0) {
      let AddOrder = await model.AddOrderQuery(
        user_id,
        amount,
        date,
        gift_card, payment_method, delivery_date, address_id
      );
      console.log(AddOrder, "AddOrder");
      if (AddOrder.insertId) {
        product_details.forEach(async (element) => {
          var insertproduct = await model.ProductInsert(AddOrder.insertId, element)
          await model.cart_remove(user_id, element)

        });
        if (payment_method == 'cod') {
          await model.PaymentInsert(AddOrder.insertId, user_id, amount, date, payment_method)

          return res.send({
            result: true,
            message: 'order added successfully',
          })

        } else {
          await model.PaymentInsert(AddOrder.insertId, user_id, amount, date, payment_method)

          let callbackurl = `https://lunarsenterprises.com:3000/bhakshanangal/razorpay/callback?order_id=${AddOrder.insertId}`
          var authHeader = {
            auth: {
              username: key_id,
              password: key_secret,
            },
          };
          var paymentLinkData = {
            amount: Number(amount) * 100, // Amount in paisa
            currency: 'INR',
            description: 'payment for product', // You can use the merchantReference or any appropriate description here
            reference_id: Order_id,
            customer: {
              name: CheckUser[0].user_name,
              email: CheckUser[0].user_email,
              phone: CheckUser[0].user_mobile // Assuming user is an object with name, contact, and email properties
            },
            callback_url: callbackurl
          };


          axios.post('https://api.razorpay.com/v1/payment_links', paymentLinkData, authHeader)
            .then(response => {
              console.log('Payment link created successfully:', response.data);
              return res.json({
                result: true,
                message: 'order added successfully',
                paymentLinkUrl: response.data.short_url
              });
              // Handle response data as needed
            })
            .catch(error => {
              console.error('Error creating payment link:', error.response.data.error);
              // Handle error response
            });

        }


      } else {
        return res.send({
          result: false,
          message: language.failed_to_add_order,
        });
      }
    } else {
      return res.send({
        result: false,
        message: "user does not exist",
      });
    }
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};



const generateOrderId = () => {
  return randtoken.generate(8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
};
