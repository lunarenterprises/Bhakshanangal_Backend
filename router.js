var express = require("express");
var route = express();

const { verifyToken, authorize } = require('./middleware/authMiddleware')

var { ApikeyVerify } = require("./components/ApiKeyVerify");
route.get('/', (req, res) => {
    res.send('bhakshanangal backend is live')
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
// route.get("/addresslist", verifyToken, authorize('user'), ListOfAddress);
route.get("/addresslist", verifyToken, ListOfAddress);

var { EditAddresses } = require("./controller/EditAddress");
// route.post("/edit-address", verifyToken, authorize('user'), EditAddresses);
route.post("/edit-address", verifyToken, EditAddresses);

var { RemoveAddress } = require("./controller/removeAddress");
// route.post("/remove-address", verifyToken, authorize('user'), RemoveAddress);
route.post("/remove-address", verifyToken, RemoveAddress);

var { AddProducts, AddProductVariants, EditProduct, EditProductVariant } = require("./controller/Addproduct");
route.post("/addproduct", verifyToken, authorize('admin'), AddProducts);
route.post("/product/addvariant", verifyToken, authorize('admin'), AddProductVariants);
route.post("/editproduct", verifyToken, EditProduct);
route.post("/product/editvariant", verifyToken, EditProductVariant);

var { AddCategory, EditCategory, AddSubCategory, EditSubCategory } = require("./controller/AddCategory");
// route.post("/add-category", verifyToken, authorize('admin'), AddCategory)
route.post("/add-category", verifyToken, AddCategory)
route.post("/edit-category", verifyToken, EditCategory)
route.post("/add-subcategory", verifyToken, AddSubCategory)
route.post("/edit-subcategory", verifyToken, EditSubCategory)

var { CategoryList, SubCategoryList } = require('./controller/categorylist')
route.post('/categorylist', CategoryList)
route.post('/list/sub-category', SubCategoryList)

var { ListAllProduct, ViewProduct } = require("./controller/ListProduct");
route.post("/productlist", ListAllProduct);
route.post('/viewproduct', ViewProduct)

var { ViewProducts } = require("./controller/viewProduct");
route.post("/productview", ViewProducts);

var { addCart } = require("./controller/addCart");
// route.post("/addcart", verifyToken, authorize('user'), addCart);
route.post("/addcart", verifyToken, addCart);

var { ViewCart } = require("./controller/viewCart");
// route.post("/viewcart", verifyToken, authorize('user'), ViewCart);
route.post("/viewcart", verifyToken, ViewCart);

var { SetDefaultAddress } = require("./controller/setDefaultAddress");
// route.post("/setaddress", verifyToken, authorize('user'), SetDefaultAddress);
route.post("/setaddress", verifyToken, SetDefaultAddress);

var { CreateOrder } = require("./controller/Create_order");
route.post("/createorder", CreateOrder);

var { AddAddresses } = require("./controller/AddAddress");
// route.post("/addaddress", verifyToken, authorize('user'), AddAddresses);
route.post("/addaddress", verifyToken, AddAddresses);

// var {capturePayment} =  require('./controller/Capturepayment')
// route.get('/capture-payment',capturePayment)

// only verification is needed
var { VerifyOrder } = require("./controller/verifyOrder");
route.post("/razorpay-webhook", VerifyOrder);

var { ViewProfile } = require("./controller/viewprofile");
// route.post("/view-profile", verifyToken, authorize('user'), ViewProfile);
route.post("/view-profile", verifyToken, ViewProfile);

var { EditProfile } = require("./controller/editprofile");
// route.post("/edit-profile", verifyToken, authorize('user'), EditProfile);
route.post("/edit-profile", verifyToken, EditProfile);

var { ValidateCoupon } = require('./controller/validateCoupon')
// route.post('/validate-coupon', verifyToken, authorize('user'), ValidateCoupon)
route.post('/validate-coupon', verifyToken, ValidateCoupon)

var { OfferAdd } = require("./controller/offerAdd");
route.post("/offer-add", OfferAdd);

var { ListOffer } = require('./controller/offerlist')
route.post('/listoffer', ListOffer)

var { orderList } = require('./controller/orderList')
// route.post('/orderlist', verifyToken, authorize('user'), orderList)
route.post('/orderlist', verifyToken, orderList)

var { Dashboard } = require('./controller/dashboard')
// route.post('/dashboard', verifyToken, authorize('admin'), Dashboard)
route.post('/dashboard', verifyToken, Dashboard)

var { ListUser } = require("./controller/listuser");
// route.post("/list-user", verifyToken, authorize('admin'), ListUser);
route.post("/list-user", verifyToken, ListUser);


var { ProductRating } = require('./controller/rating')
// route.post("/product/rating", verifyToken, authorize('user'), ProductRating)
route.post("/product/rating", verifyToken, ProductRating)

var { AddOrder } = require("./controller/addorder");
// route.post("/add-order", verifyToken, authorize('user'), AddOrder)
route.post("/add-order", verifyToken, AddOrder)

var { UpdateProducts } = require('./controller/updateproduct')
// route.post("/update-product", verifyToken, authorize('admin'), UpdateProducts)
route.post("/update-product", verifyToken, UpdateProducts)

var { DeleteUser } = require("./controller/deleteuser");
// route.post("/delete-user", verifyToken, authorize('admin'), DeleteUser)
route.post("/delete-user", verifyToken, DeleteUser)

var { AddWishlist } = require("./controller/Wishlist");
// route.post("/wishlist", verifyToken, authorize('user'), AddWishlist)
route.post("/wishlist", verifyToken, AddWishlist)

var { DeleteProduct, DeleteProductVariant, DeleteProductVariantImage } = require("./controller/deleteproduct");
// route.post("/delete-product", verifyToken, authorize('admin'), DeleteProduct)
route.post("/delete-product", verifyToken, DeleteProduct)
// route.post("/delete-variant", verifyToken, authorize('admin'), DeleteProductVariant)
route.post("/delete-variant", verifyToken, DeleteProductVariant)
// route.post("/delete-variant-image", verifyToken, authorize('admin'), DeleteProductVariantImage)
route.post("/delete-variant-image", verifyToken, DeleteProductVariantImage)

var { DeliveryStatusList } = require('./controller/deliverystatuslist')
// route.post("/delivery/status/list", verifyToken, authorize('admin'), DeliveryStatusList)
route.post("/delivery/status/list", verifyToken, DeliveryStatusList)

var { UpdateDeliveryStatus } = require('./controller/order_delivery_status_update')
// route.post("/delivery/status/update", verifyToken, authorize('admin'), UpdateDeliveryStatus)
route.post("/delivery/status/update", verifyToken, UpdateDeliveryStatus)

var { OrderVIew } = require('./controller/order_view')
// route.post("/order/view", verifyToken, authorize('admin'), OrderVIew)
route.post("/order/view", OrderVIew)

var { PaymentList } = require('./controller/paymentlist')
// route.post("/payment/list", verifyToken, authorize('admin'), PaymentList)
route.post("/payment/list", verifyToken, PaymentList)

var { AddBanner } = require('./controller/createbanner')
// route.post("/banner/create", verifyToken, authorize('admin'), AddBanner)
route.post("/banner/create", verifyToken, AddBanner)

var { BannerList } = require('./controller/bannerlist')
route.post("/banner/list", BannerList)

var { DeleteBanner } = require("./controller/deletebanner");
// route.post("/delete-banner", verifyToken, authorize('admin'), DeleteBanner)
route.post("/delete-banner", verifyToken, DeleteBanner)
// add coupon code
var { addCouponCode } = require('./controller/addCouponCode');
route.post('/coupon-code/add', addCouponCode);
// list paginate coupon code
var { listCouponCodes } = require('./controller/listCouponCode');
route.post('/coupon-code/list', listCouponCodes);
var { AddCouponOrOffer } = require('./controller/AddCouopon')
// route.post("/add-offer-coupon", verifyToken, authorize('admin'), AddCouponOrOffer)
route.post("/add-offer-coupon", verifyToken, AddCouponOrOffer)

var { DashboardProductsCart } = require('./controller/dashboard_product_cart')
// route.post("/dashboard/product/cart", verifyToken, authorize('admin'), DashboardProductsCart)
route.post("/dashboard/product/cart", verifyToken, DashboardProductsCart)

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
// route.post("/cancel-order", verifyToken, authorize('user'), CancelOrder)
route.post("/cancel-order", verifyToken, CancelOrder)

var { RazorpayCallback } = require('./controller/razorpaycallback')
route.get("/razorpay/callback", RazorpayCallback)

var { CancelList } = require('./controller/cancellist');
// route.post("/cancel/list", verifyToken, authorize(["user", "admin"]), CancelList)
route.post("/cancel/list", verifyToken, CancelList)

var { ReturnList } = require('./controller/returnlist');
// route.post("/return/list", verifyToken, authorize('admin'), ReturnList)
route.post("/return/list", verifyToken, ReturnList)

var { ListWishlist } = require('./controller/listwishlist')
// route.post("/wishlist/list", verifyToken, authorize('user'), ListWishlist)
route.post("/wishlist/list", verifyToken, ListWishlist)

var { ProductStocksList } = require('./controller/ProductStocksList')
// route.post("/product/stock/list", verifyToken, authorize('user'), ProductStocksList)
route.post("/product/stock/list", verifyToken, ProductStocksList)

var { DeleteCart } = require('./controller/deleteCart')
// route.post("/delete/cart", verifyToken, authorize('user'), DeleteCart)
route.post("/delete/cart", verifyToken, DeleteCart)

var { GoogleRegister } = require("./controller/google_register");
route.post("/google/signup", GoogleRegister);

var { ListCoupon } = require('./controller/listcoupon');
route.post("/coupon/list", ListCoupon)

var { GoogleAuthentication } = require('./controller/googlelogin')
route.post("/google/login", GoogleAuthentication);

var { ProductDropDown } = require('./controller/productdropdown');
// route.post("/product-dropdown", verifyToken, authorize('admin'), ProductDropDown)
route.post("/product-dropdown", verifyToken, ProductDropDown)

var { ForYou } = require("./controller/foryou");
// route.post("/foryou", verifyToken, authorize('user'), ForYou);
route.post("/foryou", verifyToken, ForYou);

var { Pincode_validation } = require("./controller/pincode_distance");
route.post("/pincode/validate", Pincode_validation);

var { WebVerification } = require("./controller/webverification");
route.get("/webverification", WebVerification);

var { RemoveOffer } = require("./controller/removeoffer");
// route.post("/remove-offer", verifyToken, authorize('admin'), RemoveOffer)
route.post("/remove-offer", verifyToken, RemoveOffer)

var { RemoveCoupon } = require("./controller/removecoupon");
// route.post("/remove-coupon", verifyToken, authorize('admin'), RemoveCoupon)
route.post("/remove-coupon", verifyToken, RemoveCoupon)

var { RemoveRating } = require("./controller/removerating");
// route.post("/remove-rating", verifyToken, authorize('admin'), RemoveRating)
route.post("/remove-rating", verifyToken, RemoveRating)

var { DeleteOrder } = require('./controller/DeleteOrder')
// route.post('/delete-order', verifyToken, authorize('admin'), DeleteOrder)
route.post('/delete-order', verifyToken, DeleteOrder)

var { UpdateDeliveryStatus } = require('./controller/order_delivery_status_update')
route.post('/update/delivery-status', UpdateDeliveryStatus)

var { UpdatePaymentStatus } = require('./controller/UpdatePaymentStatus')
route.post('/update/order-status', UpdatePaymentStatus)

var { DeleteCategory, DeleteSubCategory } = require('./controller/DeleteCategory')
route.post('/delete-category', verifyToken, DeleteCategory)
route.post('/delete-subcategory', verifyToken, DeleteSubCategory)

var { CreateContactUs } = require('./controller/ContactUs')
route.post('/contactus', CreateContactUs)

var { ListContactus } = require('./controller/ListContactUs');
route.get('/list/contactus', ListContactus)

var { orderListDownload } = require('./controller/orderlistDownload')
route.post('/download/order-list', orderListDownload)

var { AddProductQuestion, ListProductQuestionAnswers, AddProductQuestionAnswer, DeleteProductQuestionAnswer } = require('./controller/productQuestion')
route.post('/add/product-question', verifyToken, AddProductQuestion)
route.post('/list/product-question-answer', verifyToken, ListProductQuestionAnswers)
route.post('/add/product-answer', verifyToken, AddProductQuestionAnswer)
route.post('/delete/product-question', verifyToken, authorize('admin'), DeleteProductQuestionAnswer)




var { UpdateDeliveryDate } = require('./controller/UpdateDeliveryStatus')
route.post('/update/delivery-status', UpdateDeliveryDate)

var { AddUnit, listUnit, deleteUnit } = require('./controller/unit')
route.post('/add/unit', AddUnit)
route.post('/list/unit', listUnit)
route.post('/delete/unit', deleteUnit)

var { AddTax, listTax, deleteTax } = require('./controller/taxSchedule')
route.post('/add/tax', AddTax)
route.post('/list/tax', listTax)
route.post('/delete/tax', deleteTax)

var { AddFaq, ListFaqs, EditFaq, DeleteFaq } = require('./controller/faq')
route.post('/add/faq', AddFaq)
route.post('/list/faq', ListFaqs)
route.post('/edit/faq', EditFaq)
route.post('/delete/faq', DeleteFaq)


module.exports = route;
