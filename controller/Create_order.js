const Razorpay = require("razorpay");

module.exports.CreateOrder = async (req, res) => {
  const razorpayInstance = new Razorpay({
    key_id: "rzp_test_xYBaYWKZo0Qblb",
    key_secret: "pyos5otLClI9QH4lzr8pS0rt",
  });

  try {
    // const amount = req.body.amount * 100;
    // const options = {
    //   amount: amount,
    //   currency: "INR",
    //   receipt: "razorUser@gmail.com",
    // };

    // razorpayInstance.orders.create(options, (err, order) => {
    //     console.log(err);
    //   if (!err) {
    //     res.status(200).send({
    //       success: true,
    //       msg: "Order Created",
    //       order_id: order.id,
    //       amount: amount,
    //       key_id: "rzp_test_az7fEZxXoBzThm",
    //       product_name: req.body.name,
    //       description: req.body.description,
    //       contact: "9074543046",
    //       name: "umesh u ",
    //       email: "umeshudayan15@gmail.com",
    //     });
       
      
   
    //   } else {
    //     res.status(400).send({ success: false, msg: "Something went wrong!" });
    //   }
    // });

    let {amount,currency,receipt, notes}  = req.body;  
    amount = amount * 100     

    razorpayInstance.orders.create({amount, currency, receipt, notes},  
      (err, order)=>{ 
        
        //STEP 3 & 4:  
        if(!err) 
         return res.send({
        result:true,
        data:order
      }) 
        else
          return res.send({
            result:false,
            message:err
          }); 
      } 
  ) 
 






  } catch (error) {
    console.log(error.message);
  }
};
