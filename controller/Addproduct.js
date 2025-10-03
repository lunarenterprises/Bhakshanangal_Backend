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
    const { product_name, product_description, category, shipping = false, cod = false, refund = false, free_delivery = false, new_arrival = false, lang = 'en' } = req.body
    const language = await languages(lang);
    console.log("Body",req.body);
    
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


module.exports.AddProductVariants = async (req, res) => {
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
      const { product_id, size, unit, stock, price, discount, lang = 'en' } = fields
      const language = await languages(lang);
      if (!product_id || !size || !unit || !stock || !price || !discount) {
        return res.send({
          result: false,
          message: "Product id, size, unit, stock, price and discount are required"
        })
      }

      if (!files?.images || files?.images?.length === 0) {
        return res.send({
          result: false,
          message: "Images is required"
        })
      }

      const checkProduct = await model.CheckProductWithId(product_id)
      if (checkProduct.length === 0) {
        return res.send({
          result: false,
          message: "Product not found."
        })
      }
      const created = await model.AddProductVariant(product_id, size, unit, stock, price, discount)
      if (created.affectedRows > 0) {
        let imageArray = Array.isArray(files.images) ? files.images : [files.images];
        const uploadDir = path.join(process.cwd(), "uploads", "product");
        // Ensure the upload directory exists
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        for (let image of imageArray) {
          const oldPath = image.filepath
          const newPath = path.join(uploadDir, image.originalFilename);

          try {
            const rawData = fs.readFileSync(oldPath);
            fs.writeFileSync(newPath, rawData); // ✅ synchronous write
            const imagePath = "/uploads/product/" + image.originalFilename
            await model.AddVariantImages(created.insertId, imagePath)
          } catch (err) {
            console.error("File save error:", err);
          }
        }
        res.send({
          result: true,
          message: "Product variant added successfully"
        })
      } else {
        return res.send({
          result: false,
          message: "Failed to add product variant. Please try again later"
        })
      }
    })

  } catch (error) {
    return res.send({
      result: false,
      message: error.message
    })
  }
}


module.exports.EditProduct = async (req, res) => {
  try {
    const { product_id, product_name, product_description, category, shipping, cod, refund, free_delivery, new_arrival, lang = 'en' } = req.body
    const language = await languages(lang);
    if (!product_id || !product_name || !product_description) {
      return res.send({
        result: false,
        message: language.insufficient_parameters,
      });
    }
    const checkProductExist = await model.CheckProductWithId(product_id)
    if (checkProductExist.length === 0) {
      return res.send({
        result: false,
        message: "Product not found."
      })
    }
    let CheckProduct = await model.CheckProductQuery(product_name);
    if (CheckProduct.length > 0) {
      return res.send({
        result: false,
        message: language.product_already_exists,
      });
    }
    const checkCategory = await model.CheckCategory(category)
    if (category && checkCategory.length === 0) {
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
    await model.DeleteAllTranslations(product_id)
    array.forEach(async (el) => {
      await model.AddTranslatedProducts(
        product_id,
        el.lannum,
        el.langP,
        el.langD
      );
    });
    let updates = [];
    if (shipping !== undefined) updates.push(`shipping='${shipping}'`);
    if (cod !== undefined) updates.push(`cash_on_delivery='${cod}'`);
    if (refund !== undefined) updates.push(`refundable='${refund}'`);
    if (new_arrival !== undefined) updates.push(`new_arrival='${new_arrival}'`);
    if (free_delivery !== undefined) updates.push(`free_delivery='${free_delivery}'`);
    if (updates.length > 0) {
      const updateString = updates.join(', ');
      let updated = await model.UpdateProduct(updateString, product_id);
      if (updated.affectedRows === 0) {
        return res.send({
          result: false,
          message: "Failed to update product"
        })
      }
    }
    return res.send({
      result: true,
      message: "Product updated successfully"
    })
  } catch (error) {
    return res.send({})
  }
}


module.exports.EditProductVariant = async (req, res) => {
  try {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, async function (err, fields, files) {
      if (err) {
        return res.send({
          success: false,
          message: "File Upload Failed!",
          data: err,
        });
      }
      const { product_variant_id, size, unit, stock, price, discount, lang = 'en' } = fields
      const language = await languages(lang);
      if (!product_variant_id) {
        return res.send({
          result: false,
          message: "Product variant id is required"
        })
      }
      const checkProductVariant = await model.CheckProductVariant(product_variant_id)
      if (checkProductVariant.length === 0) {
        return res.send({
          result: false,
          message: "Product variant not found."
        })
      }
      const variantImages = await model.GetProductVariantImages(product_variant_id)
      if (variantImages.length === 0 && (!files?.images || files?.images?.length === 0)) {
        return res.send({
          result: false,
          message: "Images is required"
        })
      }
      let imageArray = Array.isArray(files.images) ? files.images : [files.images];
      const uploadDir = path.join(process.cwd(), "uploads", "product");
      // Ensure the upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      for (let image of imageArray) {
        const oldPath = image.filepath
        const newPath = path.join(uploadDir, image.originalFilename);

        try {
          const rawData = fs.readFileSync(oldPath);
          fs.writeFileSync(newPath, rawData); // ✅ synchronous write
          const imagePath = "/uploads/product/" + image.originalFilename
          await model.AddVariantImages(created.insertId, imagePath)
        } catch (err) {
          console.error("File save error:", err);
        }
      }
      let updates = [];
      if (size !== undefined) updates.push(`bpv_size='${size}'`);
      if (unit !== undefined) updates.push(`bpv_unit='${unit}'`);
      if (stock !== undefined) updates.push(`bpv_stock='${stock}'`);
      if (price !== undefined) updates.push(`bpv_price='${price}'`);
      if (discount !== undefined) updates.push(`bpv_discount='${discount}'`);
      if (updates.length > 0) {
        const updateString = updates.join(', ');
        let updated = await model.UpdateProduct(updateString, product_variant_id);
        if (updated.affectedRows === 0) {
          return res.send({
            result: false,
            message: "Failed to update product variant"
          })
        }
      }
      return res.send({
        result: true,
        message: "Product updated successfully"
      })
    })
  } catch (error) {
    return res.send({
      result: false,
      message: error.message
    })
  }
}