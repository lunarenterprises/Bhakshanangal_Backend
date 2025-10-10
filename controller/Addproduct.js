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
    const {
      product_name,
      product_description,
      category,
      sub_category,
      material,
      how_to_use,
      tax_value_ids, // now array of tax IDs
      infoArray,     // now array of {infoLabel, info}
      shipping = false,
      cod = false,
      refund = false,
      free_delivery = false,
      new_arrival = false,
      lang = 'en'
    } = req.body;

    const language = await languages(lang);

    if (!product_name || !product_description || !category || !Array.isArray(tax_value_ids) || tax_value_ids.length === 0 || !Array.isArray(infoArray)) {
      return res.send({
        result: false,
        message: language.insufficient_parameters,
      });
    }

    // Continue validation as before; you can modify these to check all tax_value_ids if needed
    const CheckProduct = await model.CheckProductQuery(product_name);
    if (CheckProduct.length > 0) {
      return res.send({
        result: false,
        message: language.product_already_exists,
      });
    }
    const checkCategory = await model.CheckCategory(category);
    if (checkCategory.length === 0) {
      return res.send({
        result: false,
        message: "Category not found",
      });
    }
    const checkSubCategory = await model.CheckSubCategory(sub_category);
    if (checkSubCategory.length === 0) {
      return res.send({
        result: false,
        message: "Sub category not found",
      });
    }

    // Helper function for translation remains the same...
    const translateText = async (text) => {
      const ar = await translatte(text, { to: "ar" });
      const fr = await translatte(text, { to: "fr" });
      const hi = await translatte(text, { to: "hi" });
      const ml = await translatte(text, { to: "ml" });
      return {
        en: text,
        ar: ar.text,
        fr: fr.text,
        hi: hi.text,
        ml: ml.text,
      };
    };

    // Prepare and translate product info as before
    const productNameTranslations = await translateText(product_name);
    const productDescriptionTranslations = await translateText(product_description);
    const materialTranslations = material ? await translateText(material) : null;
    const howToUseTranslations = how_to_use ? await translateText(how_to_use) : null;

    const translationsArray = [
      { lannum: 0, lancod: "en", langP: productNameTranslations.en, langD: productDescriptionTranslations.en, material: materialTranslations?.en, how_to_use: howToUseTranslations?.en },
      { lannum: 1, lancod: "ar", langP: productNameTranslations.ar, langD: productDescriptionTranslations.ar, material: materialTranslations?.ar, how_to_use: howToUseTranslations?.ar },
      { lannum: 2, lancod: "fr", langP: productNameTranslations.fr, langD: productDescriptionTranslations.fr, material: materialTranslations?.fr, how_to_use: howToUseTranslations?.fr },
      { lannum: 3, lancod: "hi", langP: productNameTranslations.hi, langD: productDescriptionTranslations.hi, material: materialTranslations?.hi, how_to_use: howToUseTranslations?.hi },
      { lannum: 4, lancod: "ml", langP: productNameTranslations.ml, langD: productDescriptionTranslations.ml, material: materialTranslations?.ml, how_to_use: howToUseTranslations?.ml },
    ];

    // Insert product
    const Product_insert = await model.AddProduct(
      category,
      sub_category,
      shipping,
      cod,
      refund,
      free_delivery,
      new_arrival
    );

    if (Product_insert.affectedRows > 0) {
      // Insert translations
      for (const el of translationsArray) {
        await model.AddTranslatedProducts(
          Product_insert.insertId,
          el.lannum,
          el.langP,
          el.langD,
          el.material,
          el.how_to_use
        );
      }

      // Loop and insert into bh_product_tax for each tax ID
      for (const tax_id of tax_value_ids) {
        await model.InsertProductTax(Product_insert.insertId, tax_id);
      }

      // Loop and insert product info
      for (const infoObj of infoArray) {
        if (infoObj && infoObj.infoLabel && infoObj.info) {
          await model.InsertProductInfo(Product_insert.insertId, infoObj.infoLabel, infoObj.info);
        }
      }

      return res.send({
        result: true,
        message: language.product_added_success,
        product_id: Product_insert.insertId,
        infoArray,
        tax_value_ids
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
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          result: false,
          message: "File upload failed!",
          data: err,
        });
      }

      const {
        product_id,
        sku,
        size,
        unit,
        stock,
        price,
        discount,
        lang = "en",
      } = fields;

      // 1️⃣ Validation
      if (!product_id || !sku || !size || !unit || !stock || !price || !discount) {
        return res.send({
          result: false,
          message: "Product ID, SKU, size, unit, stock, price, and discount are required",
        });
      }

      if (!files?.image) {
        return res.send({
          result: false,
          message: "At least one image is required",
        });
      }

      // 2️⃣ Check if product exists
      const checkProduct = await model.CheckProductWithId(product_id);
      if (checkProduct.length === 0) {
        return res.send({
          result: false,
          message: "Product not found",
        });
      }

      // 3️⃣ Add product variant
      const created = await model.AddProductVariant(product_id, sku, size, unit, stock, price, discount);
      if (created.affectedRows === 0) {
        return res.send({
          result: false,
          message: "Failed to add product variant. Please try again later",
        });
      }

      const variantId = created.insertId;
      const imageArray = Array.isArray(files.image) ? files.image : [files.image];
      const uploadDir = path.join(process.cwd(), "uploads", "product");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // 4️⃣ Save images
      for (let image of imageArray) {
        const oldPath = image.filepath;
        const newPath = path.join(uploadDir, image.originalFilename);

        try {
          const rawData = fs.readFileSync(oldPath);
          fs.writeFileSync(newPath, rawData);
          const imagePath = "/uploads/product/" + image.originalFilename;
          await model.AddVariantImages(variantId, imagePath);
        } catch (err) {
          console.error("File save error:", err);
        }
      }

      // 5️⃣ Response
      return res.send({
        result: true,
        message: "Product variant added successfully",
      });
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message || "An error occurred while adding product variant",
    });
  }
};



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

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({
          result: false,
          message: "File upload failed!",
          data: err,
        });
      }

      const {
        product_variant_id,
        sku,
        size,
        unit,
        stock,
        price,
        discount,
        lang = "en",
      } = fields;

      const language = await languages(lang);

      // 1️⃣ Validation
      if (!product_variant_id) {
        return res.send({
          result: false,
          message: "Product variant ID is required",
        });
      }

      // 2️⃣ Check if variant exists
      const checkProductVariant = await model.CheckProductVariant(product_variant_id);
      if (checkProductVariant.length === 0) {
        return res.send({
          result: false,
          message: "Product variant not found",
        });
      }

      // 3️⃣ Handle file deletions if needed
      if (files) {
        const fileKeys = Object.keys(files).filter((key) => key !== "image");
        if (fileKeys.length > 0) {
          await model.DeleteFilesQuery(product_variant_id, fileKeys);
        } else {
          await model.DeleteAllUserFilesQuery(product_variant_id);
        }
      }

      // 4️⃣ Handle image uploads
      if (files.image) {
        const imageArray = Array.isArray(files.image) ? files.image : [files.image];
        const uploadDir = path.join(process.cwd(), "uploads", "product");

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        for (let image of imageArray) {
          const oldPath = image.filepath;
          const newPath = path.join(uploadDir, image.originalFilename);

          try {
            const rawData = fs.readFileSync(oldPath);
            fs.writeFileSync(newPath, rawData);
            const imagePath = "/uploads/product/" + image.originalFilename;
            await model.AddVariantImages(product_variant_id, imagePath);
          } catch (err) {
            console.error("File save error:", err);
          }
        }
      }

      // 5️⃣ Update product variant fields dynamically
      let updates = [];
      if (sku !== undefined) updates.push(`bpv_sku='${sku}'`);
      if (size !== undefined) updates.push(`bpv_size='${size}'`);
      if (unit !== undefined) updates.push(`bpv_unit='${unit}'`);
      if (stock !== undefined) updates.push(`bpv_stock='${stock}'`);
      if (price !== undefined) updates.push(`bpv_price='${price}'`);
      if (discount !== undefined) updates.push(`bpv_discount='${discount}'`);

      if (updates.length > 0) {
        const updateString = updates.join(", ");
        const updated = await model.UpdateProductVariant(updateString, product_variant_id);

        if (updated.affectedRows === 0) {
          return res.send({
            result: false,
            message: "Failed to update product variant",
          });
        }
      }

      return res.send({
        result: true,
        message: "Product variant updated successfully",
      });
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message || "An error occurred",
    });
  }
};
