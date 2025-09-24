var express = require("express");
var route = express();

const { verifyToken, authorize } = require('./middleware/authMiddleware')

var { ApikeyVerify } = require("./components/ApiKeyVerify");
route.get('/', (req, res) => {
    res.send('hello bhakshanangal')
})
var { Regsiter } = require("./controller/registration");
route.post("/signup", Regsiter);

var { ForgotPassword } = require("./controller/forgot_password");
route.post("/forgotpassword", ForgotPassword);

var { Verification } = require("./controller/verification");
route.post("/verification", Verification);

var { ChangePassword } = require("./controller/change_password");
route.post("/change-password", ChangePassword);

var { Login } = require("./controller/login");
route.post("/login", Login);

var { ListOfAddress } = require("./controller/addressList");
// route.get("/addresslist", ApikeyVerify, ListOfAddress);
route.get("/addresslist", verifyToken, authorize('user'), ListOfAddress);

var { EditAddresses } = require("./controller/EditAddress");
// route.post("/edit-address", ApikeyVerify, EditAddresses);
route.post("/edit-address", verifyToken, authorize('user'), EditAddresses);

var { RemoveAddress } = require("./controller/removeAddress");
// route.post("/remove-address", ApikeyVerify, RemoveAddress);
route.post("/remove-address", verifyToken, authorize('user'), RemoveAddress);

var { AddProducts, AddProductVariants, } = require("./controller/Addproduct");
// route.post("/addproduct", verifyToken, authorize('admin'), AddProducts);
route.post("/addproduct", AddProducts);
// route.post("/product/addvariant", verifyToken, authorize('admin'),AddProductVariants);
route.post("/product/addvariant", AddProductVariants);

var { ListAllProduct, ViewProduct } = require("./controller/ListProduct");
route.post("/productlist", ListAllProduct);
route.post('/viewproduct', ViewProduct)


var { ViewProducts } = require("./controller/viewProduct");
route.post("/productview", ViewProducts);

var { addCart } = require("./controller/addCart");
// route.post("/addcart", ApikeyVerify, addCart);
route.post("/addcart", verifyToken, authorize('user'), addCart);

var { ViewCart } = require("./controller/viewCart");
// route.post("/viewcart", ApikeyVerify, ViewCart);
route.post("/viewcart", verifyToken, authorize('user'), ViewCart);

var { SetDefaultAddress } = require("./controller/setDefaultAddress");
// route.post("/setaddress", ApikeyVerify, SetDefaultAddress);
route.post("/setaddress", verifyToken, authorize('user'), SetDefaultAddress);

var { CreateOrder } = require("./controller/Create_order");
route.post("/createorder", CreateOrder);

var { AddAddresses } = require("./controller/AddAddress");
// route.post("/addaddress", ApikeyVerify, AddAddresses);
route.post("/addaddress", verifyToken, authorize('user'), AddAddresses);

var { CategoryList } = require('./controller/categorylist')
route.post('/categorylist', CategoryList)


// var {capturePayment} =  require('./controller/Capturepayment')
// route.get('/capture-payment',capturePayment)

// only verification is needed
var { VerifyOrder } = require("./controller/verifyOrder");
route.post("/razorpay-webhook", VerifyOrder);

var { ViewProfile } = require("./controller/viewprofile");
// route.post("/view-profile", ApikeyVerify, ViewProfile);
route.post("/view-profile", verifyToken, authorize('user'), ViewProfile);

var { EditProfile } = require("./controller/editprofile");
// route.post("/edit-profile", ApikeyVerify, EditProfile);
route.post("/edit-profile", verifyToken, authorize('user'), EditProfile);

var { ValidateCoupon } = require('./controller/validateCoupon')
// route.post('/validate-coupon', ApikeyVerify, ValidateCoupon)
route.post('/validate-coupon', verifyToken, authorize('user'), ValidateCoupon)

var { OfferAdd } = require("./controller/offerAdd");
route.post("/offer-add", OfferAdd);

var { ListOffer } = require('./controller/offerlist')
route.post('/listoffer', ListOffer)

var { orderList } = require('./controller/orderList')
// route.post('/orderlist', ApikeyVerify, orderList)
route.post('/orderlist', verifyToken, authorize('user'), orderList)

var { Dashboard } = require('./controller/dashboard')
// route.post('/dashboard', ApikeyVerify, Dashboard)
route.post('/dashboard', verifyToken, authorize('user'), Dashboard)

var { ListUser } = require("./controller/listuser");
route.post("/list-user", verifyToken, authorize('admin'), ListUser);

var { AddCategory } = require("./controller/AddCategory");
// route.post("/add-category", ApikeyVerify, AddCategory)
route.post("/add-category", verifyToken, authorize('admin'), AddCategory)

var { ProductRating } = require('./controller/rating')
// route.post("/product/rating", ApikeyVerify, ProductRating)
route.post("/product/rating", verifyToken, authorize('user'), ProductRating)

var { AddOrder } = require("./controller/addorder");
// route.post("/add-order", ApikeyVerify, AddOrder)
route.post("/add-order", verifyToken, authorize('user'), AddOrder)

var { UpdateProducts } = require('./controller/updateproduct')
route.post("/update-product", verifyToken, authorize('admin'), UpdateProducts)

var { DeleteUser } = require("./controller/deleteuser");
// route.post("/delete-user", ApikeyVerify, DeleteUser)
route.post("/delete-user", verifyToken, authorize('admin'), DeleteUser)

var { AddWishlist } = require("./controller/Wishlist");
// route.post("/wishlist", ApikeyVerify, AddWishlist)
route.post("/wishlist", verifyToken, authorize('user'), AddWishlist)

var { DeleteProduct } = require("./controller/deleteproduct");
// route.post("/delete-product", ApikeyVerify, DeleteProduct)
route.post("/delete-product", verifyToken, authorize('admin'), DeleteProduct)

var { DeliveryStatusList } = require('./controller/deliverystatuslist')
// route.post("/delivery/status/list", ApikeyVerify, DeliveryStatusList)
route.post("/delivery/status/list", verifyToken, authorize('admin'), DeliveryStatusList)

var { UpdateDeliveryStatus } = require('./controller/order_delivery_status_update')
// route.post("/delivery/status/update", ApikeyVerify, UpdateDeliveryStatus)
route.post("/delivery/status/update", verifyToken, authorize('admin'), UpdateDeliveryStatus)

var { OrderVIew } = require('./controller/order_view')
// route.post("/order/view", ApikeyVerify, OrderVIew)
route.post("/order/view", verifyToken, authorize('admin'), OrderVIew)

var { PaymentList } = require('./controller/paymentlist')
// route.post("/payment/list", ApikeyVerify, PaymentList)
route.post("/payment/list", verifyToken, authorize('admin'), PaymentList)

var { AddBanner } = require('./controller/createbanner')
// route.post("/banner/create", ApikeyVerify, AddBanner)
route.post("/banner/create", verifyToken, authorize('admin'), AddBanner)

var { BannerList } = require('./controller/bannerlist')
route.post("/banner/list", BannerList)

var { DeleteBanner } = require("./controller/deletebanner");
// route.post("/delete-banner", ApikeyVerify, DeleteBanner)
route.post("/delete-banner", verifyToken, authorize('admin'), DeleteBanner)

var { AddCouponOrOffer } = require('./controller/AddCouopon')
// route.post("/add-offer-coupon", ApikeyVerify, AddCouponOrOffer)
route.post("/add-offer-coupon", verifyToken, authorize('admin'), AddCouponOrOffer)

var { DashboardProductsCart } = require('./controller/dashboard_product_cart')
// route.post("/dashboard/product/cart", ApikeyVerify, DashboardProductsCart)
route.post("/dashboard/product/cart", verifyToken, authorize('admin'), DashboardProductsCart)

var { BestSellingProducts } = require('./controller/bestSellingproducts')
route.post("/product/best-selling", BestSellingProducts)

var { CartCount } = require("./controller/cartcount");
route.post("/cartcount", CartCount)

var { DropDown } = require('./controller/dropdown');
route.post("/dropdown", DropDown)

var { LatestProduct } = require('./controller/latestproduct');
route.post("/latest-product", LatestProduct)

var { RatingList } = require('./controller/ratinglist')
route.post("/rating/list", RatingList)

var { RemoveCategory } = require('./controller/RemoveCategory');
route.post("/remove-category", RemoveCategory)

var { CancelOrder } = require('./controller/cancelorder');
// route.post("/cancel-order", ApikeyVerify, CancelOrder)
route.post("/cancel-order", verifyToken, authorize('user'), CancelOrder)

var { RazorpayCallback } = require('./controller/razorpaycallback')
route.get("/razorpay/callback", RazorpayCallback)

var { CancelList } = require('./controller/cancellist');
// route.post("/cancel/list", ApikeyVerify, CancelList)
route.post("/cancel/list", verifyToken, authorize(["user", "admin"]), CancelList)

var { ReturnList } = require('./controller/returnlist');
// route.post("/return/list", ApikeyVerify, ReturnList)
route.post("/return/list", verifyToken, authorize('admin'), ReturnList)

var { ListWishlist } = require('./controller/listwishlist')
route.post("/wishlist/list", verifyToken, authorize('user'), ListWishlist)

var { ProductStocksList } = require('./controller/ProductStocksList')
// route.post("/product/stock/list", ApikeyVerify, ProductStocksList)
route.post("/product/stock/list", verifyToken, authorize('user'), ProductStocksList)

var { DeleteCart } = require('./controller/deleteCart')
// route.post("/delete/cart", ApikeyVerify, DeleteCart)
route.post("/delete/cart", verifyToken, authorize('user'), DeleteCart)

var { GoogleRegister } = require("./controller/google_register");
route.post("/google/signup", GoogleRegister);

var { ListCoupon } = require('./controller/listcoupon');
route.post("/coupon/list", ListCoupon)

var { GoogleAuthentication } = require('./controller/googlelogin')
route.post("/google/login", GoogleAuthentication);

var { ProductDropDown } = require('./controller/productdropdown');
route.post("/product-dropdown", verifyToken, authorize('admin'), ProductDropDown)

var { ForYou } = require("./controller/foryou");
route.post("/foryou", verifyToken, authorize('user'), ForYou);

var { Pincode_validation } = require("./controller/pincode_distance");
route.post("/pincode/validate", Pincode_validation);

var { WebVerification } = require("./controller/webverification");
route.get("/webverification", WebVerification);

var { RemoveOffer } = require("./controller/removeoffer");
route.post("/remove-offer", verifyToken, authorize('admin'), RemoveOffer)

var { RemoveCoupon } = require("./controller/removecoupon");
route.post("/remove-coupon", verifyToken, authorize('admin'), RemoveCoupon)

var { RemoveRating } = require("./controller/removerating");
route.post("/remove-rating", verifyToken, authorize('admin'), RemoveRating)

var { DeleteOrder } = require('./controller/DeleteOrder')
route.post('/delete-order', verifyToken, authorize('admin'), DeleteOrder)

var { UpdateDeliveryStatus } = require('./controller/order_delivery_status_update')
route.post('/update/delivery-status', UpdateDeliveryStatus)

var { UpdatePaymentStatus } = require('./controller/UpdatePaymentStatus')
route.post('/update/order-status', UpdatePaymentStatus)

var { DeleteCategory } = require('./controller/DeleteCategory')
route.post('/delete-category', DeleteCategory)

var { CreateContactUs } = require('./controller/ContactUs')
// route.post('/contactus', ApikeyVerify, CreateContactUs)
route.post('/contactus', CreateContactUs)

var { ListContactus } = require('./controller/ListContactUs');
route.get('/list/contactus', ListContactus)

var { orderListDownload } = require('./controller/orderlistDownload')
route.post('/download/order-list', orderListDownload)

var { AddProductQuestion } = require('./controller/productQuestion')
route.post('/add/product-question', AddProductQuestion)

var { AddProductQuestionAnswer } = require('./controller/productQuestion')
route.post('/add/product-answer', AddProductQuestionAnswer)

var { ListProductQuestionAnswers } = require('./controller/productQuestion')
route.post('/list/product-question-answer', ListProductQuestionAnswers)

var { UpdateDeliveryDate } = require('./controller/UpdateDeliveryStatus')
route.post('/update/delivery-status', UpdateDeliveryDate)

module.exports = route;
