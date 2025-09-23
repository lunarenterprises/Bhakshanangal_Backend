var model = require("../model/Addproduct");
var translatte = require("translatte");
var { languages } = require("../languages/languageFunc");
var fs = require("fs");
const path = require('path')
const util = require('util')
const { upload } = require("../components/product_uploader");
const moment = require("moment");
var formidable = require("formidable");

module.exports.AddProducts = async (req, res) => {
  try {
    // var form = new formidable.IncomingForm({ multiples: true });
    // form.parse(req, async function (err, fields, files) {
    //   if (err) {
    //     return res.send({
    //       success: false,
    //       message: "File Upload Failed!",
    //       data: err,
    //     });
    //   }

    // let CheckAdmin = await model.CheckAdminQuery(req.headers.user_id);
    const { product_name, product_description, category, shipping = false, cod = false, refund = false, free_delivery = false, new_arrival = false, lang } = req.body
    const language = await languages(lang);
    if (
      !product_name ||
      !product_description ||
      !category
    ) {
      return res.send({
        result: false,
        message: language.insufficient_parameters,
      });
    }
    let CheckProduct = await model.CheckProductQuery(product_name);
    if (CheckProduct.length > 0) {
      return res.send({
        result: false,
        message: language.product_already_exists,
      });
    }
    const checkCategory = await model.CheckCategory(category)
    if (checkCategory.length === 0) {
      return res.send({
        result: false,
        message: "Category not found"
      })
    }
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
      shipping,
      cod,
      refund,
      free_delivery,
      new_arrival
    );

    if (Product_insert.affectedRows > 0) {
      // let getproduct = Product_insert.insertId;
      // let productStock = await model.AddProductStock(stock, getproduct);
      // const readFile = util.promisify(fs.readFile);
      // const writeFile = util.promisify(fs.writeFile);
      // const imageFiles = Array.isArray(files.image) ? files.image : [files.image];

      // for (const [index, file] of imageFiles.entries()) {
      //   try {
      //     const oldPath = file.filepath;
      //     const filename = file.originalFilename;
      //     const newPath = path.join(process.cwd(), "uploads", "product", filename);
      //     const filepathh = "/uploads/product/" + filename;

      //     const rawData = await readFile(oldPath);
      //     await writeFile(newPath, rawData);

      //     const InsertImages = await model.AddProductImage(getproduct, filepathh, index);
      //     if (InsertImages.affectedRows === 0) {
      //       return res.send({
      //         result: false,
      //         message: "Failed to insert image"
      //       });
      //     }
      //   } catch (err) {
      //     console.error("File handling error:", err);
      //     return res.status(500).send({
      //       result: false,
      //       message: "Internal server error while updating product"
      //     });
      //   }
      // }

      // let Addprice = await model.AddProductPrice(getproduct, priceinINR);
      array.forEach(async (el) => {
        await model.AddTranslatedProducts(
          Product_insert.insertId,
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
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
