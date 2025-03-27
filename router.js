var express = require("express");
var route = express();
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
route.get("/addresslist", ApikeyVerify, ListOfAddress);

var { EditAddresses } = require("./controller/EditAddress");
route.post("/edit-address", ApikeyVerify, EditAddresses);

var { RemoveAddress } = require("./controller/removeAddress");
route.post("/remove-address", ApikeyVerify, RemoveAddress);

var { AddProducts } = require("./controller/Addproduct");
route.post("/addproduct", AddProducts);

var { ListProduct } = require("./controller/ListProduct");
route.post("/productlist", ListProduct);

var { ViewProducts } = require("./controller/viewProduct");
route.post("/productview", ViewProducts);

var { addCart } = require("./controller/addCart");
route.post("/addcart", ApikeyVerify, addCart);

var { ViewCart } = require("./controller/viewCart");
route.post("/viewcart", ApikeyVerify, ViewCart);

var { SetDefaultAddress } = require("./controller/setDefaultAddress");
route.post("/setaddress", ApikeyVerify, SetDefaultAddress);

var { CreateOrder } = require("./controller/Create_order");
route.post("/createorder", CreateOrder);

var { AddAddresses } = require("./controller/AddAddress");
route.post("/addaddress", ApikeyVerify, AddAddresses);

var { CategoryList } = require('./controller/categorylist')
route.post('/categorylist', CategoryList)


// var {capturePayment} =  require('./controller/Capturepayment')
// route.get('/capture-payment',capturePayment)

// only verification is needed
var { VerifyOrder } = require("./controller/verifyOrder");
route.post("/razorpay-webhook", VerifyOrder);

var { ViewProfile } = require("./controller/viewprofile");
route.post("/view-profile", ApikeyVerify, ViewProfile);

var { EditProfile } = require("./controller/editprofile");
route.post("/edit-profile", ApikeyVerify, EditProfile);

var { ValidateCoupon } = require('./controller/validateCoupon')
route.post('/validate-coupon', ApikeyVerify, ValidateCoupon)

var { OfferAdd } = require("./controller/offerAdd");
route.post("/offer-add", OfferAdd);

var { ListOffer } = require('./controller/offerlist')
route.post('/listoffer', ListOffer)

var { orderList } = require('./controller/orderList')
route.post('/orderlist', ApikeyVerify, orderList)

var { Dashboard } = require('./controller/dashboard')
route.post('/dashboard', ApikeyVerify, Dashboard)

var { ListUser } = require("./controller/listuser");
route.post("/list-user", ListUser);

var { AddCategory } = require("./controller/AddCategory");
route.post("/add-category", ApikeyVerify, AddCategory)

var { ProductRating } = require('./controller/rating')
route.post("/product/rating", ApikeyVerify, ProductRating)

var { AddOrder } = require("./controller/addorder");
route.post("/add-order", ApikeyVerify, AddOrder)

var { UpdateProducts } = require('./controller/updateproduct')
route.post("/update-product", UpdateProducts)

var { DeleteUser } = require("./controller/deleteuser");
route.post("/delete-user", ApikeyVerify, DeleteUser)

var { AddWishlist } = require("./controller/Wishlist");
route.post("/wishlist", ApikeyVerify, AddWishlist)

var { DeleteProduct } = require("./controller/deleteproduct");
route.post("/delete-product", ApikeyVerify, DeleteProduct)

var { DeliveryStatusList } = require('./controller/deliverystatuslist')
route.post("/delivery/status/list", ApikeyVerify, DeliveryStatusList)

var { UpdateDeliveryStatus } = require('./controller/order_delivery_status_update')
route.post("/delivery/status/update", ApikeyVerify, UpdateDeliveryStatus)

var { OrderVIew } = require('./controller/order_view')
route.post("/order/view", ApikeyVerify, OrderVIew)

var { PaymentList } = require('./controller/paymentlist')
route.post("/payment/list", ApikeyVerify, PaymentList)

var { AddBanner } = require('./controller/createbanner')
route.post("/banner/create", ApikeyVerify, AddBanner)

var { BannerList } = require('./controller/bannerlist')
route.post("/banner/list", BannerList)

var { DeleteBanner } = require("./controller/deletebanner");
route.post("/delete-banner", ApikeyVerify, DeleteBanner)

var { AddCouponOrOffer } = require('./controller/AddCouopon')
route.post("/add-offer-coupon", ApikeyVerify, AddCouponOrOffer)

var { DashboardProductsCart } = require('./controller/dashboard_product_cart')
route.post("/dashboard/product/cart", ApikeyVerify, DashboardProductsCart)

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
route.post("/cancel-order", ApikeyVerify, CancelOrder)

var { RazorpayCallback } = require('./controller/razorpaycallback')
route.get("/razorpay/callback", RazorpayCallback)

var { CancelList } = require('./controller/cancellist');
route.post("/cancel/list", ApikeyVerify, CancelList)

var { ReturnList } = require('./controller/returnlist');
route.post("/return/list", ApikeyVerify, ReturnList)

var { ListWishlist } = require('./controller/listwishlist')
route.post("/wishlist/list", ListWishlist)

var { ProductStocksList } = require('./controller/ProductStocksList')
route.post("/product/stock/list", ApikeyVerify, ProductStocksList)

var { DeleteCart } = require('./controller/deleteCart')
route.post("/delete/cart", ApikeyVerify, DeleteCart)

var { GoogleRegister } = require("./controller/google_register");
route.post("/google/signup", GoogleRegister);

var { ListCoupon } = require('./controller/listcoupon');
route.post("/coupon/list", ListCoupon)

var { GoogleAuthentication } = require('./controller/googlelogin')
route.post("/google/login", GoogleAuthentication);

var { ProductDropDown } = require('./controller/productdropdown');
route.post("/product-dropdown", ProductDropDown)

var { ForYou } = require("./controller/foryou");
route.post("/foryou", ForYou);

var { Pincode_validation } = require("./controller/pincode_distance");
route.post("/pincode/validate", Pincode_validation);

var { WebVerification } = require("./controller/webverification");
route.get("/webverification", WebVerification);

var { RemoveOffer } = require("./controller/removeoffer");
route.post("/remove-offer", RemoveOffer)

var { RemoveCoupon } = require("./controller/removecoupon");
route.post("/remove-coupon", RemoveCoupon)

var { RemoveRating } = require("./controller/removerating");
route.post("/remove-rating", RemoveRating)

var { DeleteOrder } = require('./controller/DeleteOrder')
route.post('/delete-order', DeleteOrder)

var { UpdateDeliveryDate } = require('./controller/UpdateDeliveryStatus')
route.post('/update/delivery-status', UpdateDeliveryDate)

var { UpdatePaymentStatus } = require('./controller/UpdatePaymentStatus')
route.post('/update/order-status', UpdatePaymentStatus)

var { DeleteCategory } = require('./controller/DeleteCategory')
route.post('/delete-category', DeleteCategory)

module.exports = route;
