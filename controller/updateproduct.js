var model = require('../model/updateproduct')
var translatte = require('translatte');
var { languages } = require('../languages/languageFunc');
var fs = require('fs');
const path=require('path')
const { upload } = require("../components/product_uploader");
const moment = require('moment');
// const Uploads = upload.array("image")
var formidable = require("formidable");


module.exports.UpdateProducts = async (req, res) => {
    try {
        var form = new formidable.IncomingForm({ multiples: true });
        form.parse(req, async function (err, fields, files) {
            try {
                if (err) {
                    return res.send({
                        success: false,
                        message: "File Upload Failed!",
                        data: err,
                    })
                }
                console.log("files : ", files)
                var CheckAdmin = await model.CheckAdminQuery(req.headers.user_id)
                var lang = fields.language;
                var language = await languages(lang);
                var product_name = fields.product_name
                var product_description = fields.product_description
                var priceinINR = fields.priceinINR
                var priceinUSD = fields.priceinUSD
                var priceinEUR = fields.priceinEUR
                var priceinAED = fields.priceinAED
                var quantity = fields.quantity
                var shipping = fields.shipping
                var cod = fields.cod
                var refund = fields.refund
                var free_delivery = fields.free_delivery
                var category = fields.category
                var unit = fields.unit
                var date = moment().format('YYYY-MM-DD')
                var product_id = fields.product_id
                var product_status = fields.product_status
                var stock = fields.stock
                // var image = req.images

                if (CheckAdmin.length > 0) {
                    if (product_name !== '' && product_name !== undefined) {
                        var product_nameInArab = await translatte(product_name, { to: 'ar' })
                        product_nameInArab = product_nameInArab.text
                        var product_nameInFrench = await translatte(product_name, { to: 'fr' })
                        product_nameInFrench = product_nameInFrench.text
                        var product_nameInHindi = await translatte(product_name, { to: 'hi' })
                        product_nameInHindi = product_nameInHindi.text
                        var product_nameInmalayalam = await translatte(product_name, { to: 'ml' })
                        product_nameInmalayalam = product_nameInmalayalam.text
                    }
                    if (product_description !== '' && product_description !== undefined) {
                        var product_descriptionInArab = await translatte(product_description, { to: 'ar' })
                        product_descriptionInArab = product_descriptionInArab.text
                        var product_descriptionInFrench = await translatte(product_description, { to: 'fr' })
                        product_descriptionInFrench = product_descriptionInFrench.text
                        var product_descriptionInHindi = await translatte(product_description, { to: 'hi' })
                        product_descriptionInHindi = product_descriptionInHindi.text
                        var product_descriptionInmalayalam = await translatte(product_description, { to: 'ml' })
                        product_descriptionInmalayalam = product_descriptionInmalayalam.text
                        // var product_nameInenglish = 'en'
                        // var product_nameInArabcode = 'ar'
                        // var product_nameInFrenchcode = 'fr'
                        // var product_nameInHindicode = 'hi'
                        // var product_nameInmalayalamcode = 'ml'
                    }
                    var array = [{
                        lancod: "en",
                        lanid: 0,
                        langP: product_name,
                        langD: product_description,
                    },
                    {
                        lancod: "ar",
                        lanid: 1,
                        langP: product_nameInArab,
                        langD: product_descriptionInArab,
                    }, {
                        lancod: "fr",
                        lanid: 2,
                        langP: product_nameInFrench,
                        langD: product_descriptionInFrench,
                    }, {
                        lancod: "hi",
                        lanid: 3,
                        langP: product_nameInHindi,
                        langD: product_descriptionInHindi,
                    }, {
                        lancod: "ml",
                        lanid: 4,
                        langP: product_nameInmalayalam,
                        langD: product_descriptionInmalayalam,
                    }
                    ]

                    // var CheckProduct = await model.CheckProductQuery(product_name)
                    // if (CheckProduct.length > 0) {
                    //     return res.send({
                    //         result: false,
                    //         message: language.product_already_exists
                    //     })
                    // } else {
                    var Product_insert = await model.AddProduct(category, quantity, shipping, cod, refund, free_delivery, unit, date, product_id)
                    console.log(Product_insert);
                    if (stock) {
                        var productStock = await model.AddProductStock(stock, product_id)
                    }
                    if (product_status) {
                        var productStock = await model.AddProductStockStatus(product_status, product_id)

                    }
                    // Object.keys(files).forEach((element) => {
                    //     var oldPath = files[element]["filepath"];
                    //     var newPath =
                    //         process.cwd() +
                    //         "/uploads/product/" +
                    //         files[element]["originalFilename"];

                    //     let rawData = fs.readFileSync(oldPath);
                    //     // console.log(newPath, "new");
                    //     fs.writeFile(newPath, rawData, async function (err) {
                    //         if (err) console.log(err);
                    //         if (element == "image") {
                    //             let filepathh =
                    //                 "uploads/product/" + files[element]["originalFilename"];
                    //             await model.AddProductImage(product_id, filepathh, 0);
                    //         } else if (element == "image1") {
                    //             let filepathh =
                    //                 "uploads/product/" + files[element]["originalFilename"];
                    //             await model.AddProductImage(product_id, filepathh, 1);
                    //         } else if (element == "image2") {
                    //             let filepathh =
                    //                 "uploads/product/" + files[element]["originalFilename"];
                    //             await model.AddProductImage(product_id, filepathh, 2);
                    //         } else if (element == "image3") {
                    //             let filepathh =
                    //                 "uploads/product/" + files[element]["originalFilename"];
                    //             await model.AddProductImage(product_id, filepathh, 3);
                    //         }
                    //     });
                    // });
                    const imageFiles = Array.isArray(files.image) ? files.image : [files.image];
                    console.log("imageFiles : ", imageFiles)
                    if (imageFiles.length > 0) {
                        for (const [index, file] of imageFiles.entries()) {
                            try {
                                const oldPath = file?.filepath;
                                const filename = file?.originalFilename;
                                const newPath = path.join(process.cwd(), "uploads", "product", filename);
                                const filepathh = "/uploads/product/" + filename;
                                console.log("filepathh : ", filepathh)
                                const rawData = await readFile(oldPath);
                                await writeFile(newPath, rawData);

                                await model.AddProductImage(product_id, filepathh, index);
                                if (InsertImages.affectedRows === 0) {
                                    return res.send({
                                        result: false,
                                        message: "Failed to insert image"
                                    });
                                }
                            } catch (err) {
                                console.error("File handling error:", err);
                                return res.status(500).send({
                                    result: false,
                                    message: "Internal server error while updating product"
                                });
                            }
                        }
                    }
                    if (priceinINR) {
                        var Addprice = await model.AddProductPrice(product_id, priceinINR)
                    }

                    if (product_name || product_description) {
                        array.forEach(async (el) => {
                            await model.AddTranslatedProducts(product_id, el.lanid, el.langP, el.langD)
                        })
                    }


                    return res.send({
                        result: true,
                        message: language.product_update_success
                    })


                    // }
                } else {
                    return res.send({
                        result: false,
                        message: language.Try_with_admin_level_Account
                    })
                }
            } catch (error) {
                console.log(error, "error1");
                return res.send({
                    result: false,
                    message: error.message,
                });
            }
        })

    } catch (error) {
        console.log(error, "error3");
        return res.send({
            result: false,
            message: error.message,
        });
    }
}