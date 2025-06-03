var model = require("../model/Addproduct");
var translatte = require("translatte");
var { languages } = require("../languages/languageFunc");
var fs = require("fs");
const { upload } = require("../components/product_uploader");
const moment = require("moment");
var formidable = require("formidable");

module.exports.AddProducts = async (req, res) => {
  try {
    var form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, async function (err, fields, files) {
      if (err) {
        return res.send({
          success: false,
          message: "File Upload Failed!",
          data: err,
        });
      }

      let CheckAdmin = await model.CheckAdminQuery(req.headers.user_id);
      var lang = fields.language;
      var language = await languages(lang);
      let product_name = fields.product_name;
      let product_description = fields.product_description;
      let priceinINR = fields.priceinINR;
      let priceinUSD = fields.priceinUSD;
      let priceinEUR = fields.priceinEUR;
      let priceinAED = fields.priceinAED;
      let quantity = fields.quantity;
      let shipping = fields.shipping;
      let cod = fields.cod;
      let refund = fields.refund;
      let free_delivery = fields.free_delivery;
      let category = fields.category;
      let unit = fields.unit;
      let date = moment().format("YYYY-MM-DD");
      let stock = fields.stock;
      // let image = req.images

      if (
        !product_name ||
        !product_description ||
        !quantity ||
        !shipping ||
        !cod ||
        !refund ||
        !free_delivery ||
        !category ||
        !unit
      ) {
        return res.send({
          result: false,
          message: language.insufficient_parameters,
        });
      }

      if (!priceinINR && !priceinUSD && !priceinEUR && !priceinAED) {
        return res.send({
          result: false,
          message: language.price_not_valid,
        });
      }
      if (CheckAdmin.length > 0) {
        let CheckProduct = await model.CheckProductQuery(product_name);
        if (CheckProduct.length > 0) {
          return res.send({
            result: false,
            message: language.product_already_exists,
          });
        } else {
          let product_nameInArab = await translatte(product_name, { to: "ar" });
          product_nameInArab = product_nameInArab.text;
          let product_nameInFrench = await translatte(product_name, { to: "fr" });
          product_nameInFrench = product_nameInFrench.text;
          let product_nameInHindi = await translatte(product_name, { to: "hi" });
          product_nameInHindi = product_nameInHindi.text;
          let product_nameInmalayalam = await translatte(product_name, {
            to: "ml",
          });
          product_nameInmalayalam = product_nameInmalayalam.text;

          let product_descriptionInArab = await translatte(product_description, {
            to: "ar",
          });
          product_descriptionInArab = product_descriptionInArab.text;
          let product_descriptionInFrench = await translatte(
            product_description,
            { to: "fr" }
          );
          product_descriptionInFrench = product_descriptionInFrench.text;
          let product_descriptionInHindi = await translatte(product_description, {
            to: "hi",
          });
          product_descriptionInHindi = product_descriptionInHindi.text;
          let product_descriptionInmalayalam = await translatte(
            product_description,
            { to: "ml" }
          );
          product_descriptionInmalayalam = product_descriptionInmalayalam.text;
          // let product_nameInenglish = 'en'
          // let product_nameInArabcode = 'ar'
          // let product_nameInFrenchcode = 'fr'
          // let product_nameInHindicode = 'hi'
          // let product_nameInmalayalamcode = 'ml'
          let array = [
            {
              lannum: 0,
              lancod: "en",
              langP: product_name,
              langD: product_description,
            },
            {
              lannum: 1,
              lancod: "ar",
              langP: product_nameInArab,
              langD: product_descriptionInArab,
            },
            {
              lannum: 2,
              lancod: "fr",
              langP: product_nameInFrench,
              langD: product_descriptionInFrench,
            },
            {
              lannum: 3,
              lancod: "hi",
              langP: product_nameInHindi,
              langD: product_descriptionInHindi,
            },
            {
              lannum: 4,
              lancod: "ml",
              langP: product_nameInmalayalam,
              langD: product_descriptionInmalayalam,
            },
          ];


          var Product_insert = await model.AddProduct(
            category,
            quantity,
            shipping,
            cod,
            refund,
            free_delivery,
            unit,
            date
          );

          if (Product_insert.affectedRows > 0) {
            let getproduct = Product_insert.insertId;
            let productStock = await model.AddProductStock(stock, getproduct);
            // console.log(files);

            //   Object.keys(files).forEach((element) => {
            //     console.log(element, "element");

            //     var oldPath = files[element]["filepath"];
            //     var newPath =
            //       process.cwd() +
            //       "/uploads/product/" +
            //       files[element]["originalFilename"];

            //     let rawData = fs.readFileSync(oldPath);
            //     // console.log(newPath, "new");
            //     fs.writeFile(newPath, rawData, async function (err) {
            //       if (err) console.log(err);
            //       if (element == "image") {
            //         let filepathh =
            //           "uploads/product/" + files[element]["originalFilename"];
            //         await model.AddProductImage(getproduct, filepathh, 0);
            //       } else if (element == "image1") {
            //         let filepathh =
            //           "uploads/product/" + files[element]["originalFilename"];
            //         await model.AddProductImage(getproduct, filepathh, 1);
            //       } else if (element == "image2") {
            //         let filepathh =
            //           "uploads/product/" + files[element]["originalFilename"];
            //         await model.AddProductImage(getproduct, filepathh, 2);
            //       } else if (element == "image3") {
            //         let filepathh =
            //           "uploads/product/" + files[element]["originalFilename"];
            //         await model.AddProductImage(getproduct, filepathh, 3);
            //       }
            //     });
            //   });

            const imageFiles = Array.isArray(files.image) ? files.image : [files.image];

            for (const [file, index] of imageFiles) {
              try {
                const oldPath = file.filepath;
                const filename = file.originalFilename;
                const newPath = path.join(process.cwd(), "uploads", "product", filename);
                const filepathh = "/uploads/product/" + filename;

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

            let Addprice = await model.AddProductPrice(getproduct, priceinINR);
            array.forEach(async (el) => {
              await model.AddTranslatedProducts(
                getproduct,
                el.lannum,
                el.langP,
                el.langD
              );
            });

            return res.send({
              result: true,
              message: language.product_added_success,
            });
          } else {
            return res.send({
              result: false,
              message: language.product_not_added,
            });
          }
        }
      } else {
        return res.send({
          result: false,
          message: language.Try_with_admin_level_Account,
        });
      }
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
