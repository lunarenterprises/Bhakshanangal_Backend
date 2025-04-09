var model = require("../model/addorder");
var { languages } = require('../languages/languageFunc')
var moment = require("moment");
const randtoken = require('rand-token');
var axios = require('axios')
var nodemailer = require("nodemailer");


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
    var CheckUser = await model.CheckUserQuery(user_id);
    if (CheckUser.length > 0) {
      let AddOrder = await model.AddOrderQuery(user_id, amount, date, gift_card, payment_method, delivery_date, address_id); //add order
      console.log(AddOrder, "AddOrder");
      //get address
      var getaddress = await model.GetAddress(address_id)

      if (AddOrder.insertId) {
        var tablehtml = ''

        for (const element of product_details) {
          var insertproduct = await model.ProductInsert(AddOrder.insertId, element)
          await model.cart_remove(user_id, element)

          let checkproduct = await model.getproduct(element.product_id);
          // console.log(checkproduct);
          if (checkproduct.length > 0) {

            tablehtml += '<tr>' +
              '<td>' + checkproduct[0]?.product_name + '</td>' +
              '<td>' + checkproduct[0]?.price + '</td>' +
              '<td>' + element.order_quantity + '</td>' +
              '<td>' + element.order_unit + '</td>' +
              '<td>' + (parseFloat(checkproduct[0]?.price) * parseFloat(element.order_quantity)) + '</td>' +
              '</tr>';

          } else {
            return res.send({
              result: false,
              message: "product not found"
            })
          }
        };
        if (payment_method == 'Cash on Delivery') {
          await model.PaymentInsert(AddOrder.insertId, user_id, amount, date, payment_method)
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
                    <td class="total">${amount}</td>
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
            email: 'bhakshanangalfoods@gmail.com',
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
        <p><strong>Payment Method:</strong> Cash on delivery</p>
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
                    <td class="total">${amount}</td>
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
              from: "BHAKSHANAGAL <noreply@bhakshanangal.com>",
              to: el.email,
              subject: el.subject,
              html: el.html
            });
            nodemailer.getTestMessageUrl(infos);

          });

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
