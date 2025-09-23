var model = require("../model/AddCoupon")
var { languages } = require("../languages/languageFunc");


module.exports.AddCouponOrOffer = async (req, res) => {
    try {
        const { user_id } = req?.user || req?.headers
        var lang = req.body.language;
        var language = await languages(lang);
        var ValidFrom = req.body.valid_from;
        var ValidTo = req.body.valid_to;
        var description = req.body.description
        var discount = req.body.discount
        var offer = req.body.offer
        var coupon = req.body.coupon
        var category = req.body.category
        var product = req.body.product
        var name = req.body.name
        var coupon_code = req.body.coupon_code

        if (!ValidFrom || !ValidTo || !discount || !description) {
            return res.send({
                result: false,
                message: language.insufficient_parameters
            })
        }
        // if (!category && !product) {
        //     return res.send({
        //         result: false,
        //         message: language.product_or_category
        //     })
        // }
        if (coupon == true && offer == true) {
            return res.send({
                result: false,
                message: language.coupon_or_offer
            })
        }
        if (coupon == false && offer == false) {
            return res.send({
                result: false,
                message: language.coupon_or_offer
            })
        }

        let CheckUser = await model.CheckUserQuery(user_id);
        if (CheckUser.length > 0) {
            if (coupon == true) {
                if (!coupon_code) {
                    coupon_code = coupongenerator()
                }
                console.log(coupon_code, "coupon_code");
                var checkCoupon = await model.GetcouponCheck(name)
                if (checkCoupon.length > 0) {
                    let coupon_id = checkCoupon[0].coupon_id
                    let updateCoupon = await model.UpdateCoupon(coupon_code, discount, ValidFrom, ValidTo, coupon_id)
                    let deleteCouponproduct = await model.removeCouponProducts(coupon_id)
                    if ((category && product) || product) {
                        product.forEach(async (element) => {
                            let insertProductInoffer = await model.AddproductCoupon(coupon_id, element)
                        })
                    } else {
                        category.forEach(async (element) => {
                            let get_category = await model.Getcategory(element)
                            get_category.forEach(async (elem) => {
                                let insertProductInoffer = await model.AddproductCoupon(coupon_id, elem.product_id)
                            });
                        });
                    }

                } else {
                    let getCoupon_id = await model.AddCouponQuery(name, coupon_code, discount, ValidFrom, ValidTo)
                    let coupon_id = getCoupon_id[0].coupon_id
                    if ((category && product) || product) {
                        product.forEach(async (element) => {
                            let insertProductInoffer = await model.AddproductCoupon(coupon_id, element)
                        })
                    } else {
                        category.forEach(async (element) => {
                            let get_category = await model.Getcategory(element)
                            get_category.forEach(async (elem) => {
                                let insertProductInoffer = await model.AddproductCoupon(coupon_id, elem.product_id)
                            });
                        });
                    }
                }
                return res.send({
                    result: true,
                    message: language.product_coupon_added_successfully
                })
            } else if (offer == true) {
                let checkOffer = await model.GetofferCheck(name)
                if (checkOffer.length > 0) {
                    let offer_id = checkOffer[0].offer_id
                    let updateOffer = await model.UpdateOffer(discount, description, ValidFrom, ValidTo, offer_id)
                    let deleteCouponproduct = await model.removeCouponProducts(offer_id)
                    if ((category && product) || product) {
                        for (const element of product) {
                            let checkproduct = await model.checkproductQuery(element)
                            if (checkproduct.length > 0) {
                                condition = `a`
                                let insertproductoffer = await model.AddproductQuery(offer_id, element)
                            } else {
                                condition = `b`
                            }
                        };
                    } else {
                        for (const element of category) {
                            let getproductid = await model.Getcategory(element)
                            if (getproductid.length > 0) {
                                for (const el of getproductid) {
                                    let insertproductoffer = await model.AddproductQuery(offer_id, el.product_id)
                                }
                            }
                        }
                    }

                } else {
                    let getoffer_id = await model.AddOfferQuery(name, discount, description, ValidFrom, ValidTo)
                    let offer_id = getoffer_id.insertId
                    if ((category && product) || product) {
                        product.forEach(async (element) => {
                            let insertProductInoffer = await model.Addproductoffer(offer_id, element)
                        });
                    } else {
                        for (const element of category) {
                            let getproductid = await model.Getcategory(element)
                            if (getproductid.length > 0) {
                                for (const el of getproductid) {
                                    let insertproductoffer = await model.AddproductQuery(offer_id, el.product_id)
                                }
                            }
                        }
                    }

                }

                return res.send({
                    result: true,
                    message: language.product_offer_added_successfully
                })

            }



        }
    } catch (error) {
        console.log(error);
        return res.send({
            result: false,
            message: error.message,
        });
    }
}

function coupongenerator() {
    var coupon = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < 10; i++) {
        coupon += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return coupon;
}
