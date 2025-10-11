var model = require("../model/Addproduct");
var translatte = require("translatte");
var { languages } = require("../languages/languageFunc");
var fs = require("fs");
const path = require('path')
const util = require('util')
const { upload } = require("../components/product_uploader");
const moment = require("moment");
var formidable = require("formidable");
const { generateSku } = require('../util/skuGenerator');

module.exports.AddProducts = async (req, res) => {
  try {
    const {
      product_name,
      product_description,
      category,
      sub_category,
      material,
      how_to_use,
      tax_value_ids, // array of tax IDs
      infoArray,     // array of {infoLabel, info}
      shipping = false,
      cod = false,
      refund = false,
      free_delivery = false,
      new_arrival = false,
      lang = 'en'
    } = req.body;

    const language = await languages(lang);

    if (
      !product_name || !product_description || !category ||
      !Array.isArray(tax_value_ids) || tax_value_ids.length === 0 ||
      !Array.isArray(infoArray)
    ) {
      return res.send({
        result: false,
        message: language.insufficient_parameters,
      });
    }

    // Validate existing data as before
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

    // Translate helper unchanged
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

      // Insert into bh_product_tax and gather detailed tax info for response
      const taxDetails = [];
      for (const tax_id of tax_value_ids) {
        await model.InsertProductTax(Product_insert.insertId, tax_id);

        // Fetch full tax detail for each tax_id
        const taxDetail = await model.GetTaxDetailsById(tax_id);
        if (taxDetail) {
          taxDetails.push(taxDetail);
        }
      }

      // Insert product info records
      for (const infoObj of infoArray) {
        if (infoObj && infoObj.infoLabel && infoObj.info) {
          await model.InsertProductInfo(Product_insert.insertId, infoObj.infoLabel, infoObj.info);
        }
      }

      return res.send({
        result: true,
        message: language.product_added_success,
        product_id: Product_insert.insertId,
        product_name,
        product_description,
        category,
        sub_category,
        material,
        how_to_use,
        tax_value_ids,
        taxDetails,    // full tax details array returned here
        infoArray,
        shipping,
        cod,
        refund,
        free_delivery,
        new_arrival,
        lang
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
        size,
        unit,
        stock,
        price,
        discount,
        selling_price,
        gst_price,
        vat_price,
        lang = "en",
      } = fields;

      // Validation
      if (
        !product_id || !size || !unit ||
        stock === undefined || price === undefined ||
        discount === undefined || selling_price === undefined ||
        gst_price === undefined || vat_price === undefined
      ) {
        return res.send({
          result: false,
          message:
            "All fields product_id, sku, size, unit, stock, price, discount, selling_price, gst_price, vat_price are required",
        });
      }

      if (!files?.image) {
        return res.send({
          result: false,
          message: "At least one image is required",
        });
      }

      // Check product exists
      const checkProduct = await model.CheckProductWithId(product_id);
      if (checkProduct.length === 0) {
        return res.send({
          result: false,
          message: "Product not found",
        });
      }
      let sku = generateSku(product_id);
      // Add product variant
      const created = await model.AddProductVariant(
        product_id,
        sku,
        Number(size),
        unit,
        Number(stock),
        Number(price),
        Number(discount),
        Number(selling_price),
        Number(gst_price),
        Number(vat_price)
      );
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

      // Save images one by one
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

      // Response success
      return res.send({
        result: true,
        message: "Product variant added successfully",
        variant_id: variantId
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
  console.log("EditProduct", req.body);
  try {
    const {
      product_id,
      product_name,
      product_description,
      category,
      shipping,
      cod,
      refund,
      free_delivery,
      new_arrival,
      tax_value_ids,     // array of tax schedule ids
      infoArray,         // array of { infoLabel, infoValue }
      lang = 'en',
    } = req.body;

    const language = await languages(lang);

    if (!product_id || !product_name || !product_description) {
      return res.send({
        result: false,
        message: language.insufficient_parameters,
      });
    }

    const checkProductExist = await model.CheckProductWithId(product_id);
    if (checkProductExist.length === 0) {
      return res.send({
        result: false,
        message: "Product not found."
      });
    }

    const CheckProduct = await model.CheckProductQuery(product_name);
    // Allow updating current product name to same name (ignore if same ID)
    if (CheckProduct.length > 0 && CheckProduct[0].product_id !== Number(product_id)) {
      return res.send({
        result: false,
        message: language.product_already_exists,
      });
    }

    if (category) {
      const checkCategory = await model.CheckCategory(category);
      if (checkCategory.length === 0) {
        return res.send({
          result: false,
          message: "Category not found"
        });
      }
    }

    // Translate product name/description into all languages
    const product_nameInArab = (await translatte(product_name, { to: "ar" })).text;
    const product_nameInFrench = (await translatte(product_name, { to: "fr" })).text;
    const product_nameInHindi = (await translatte(product_name, { to: "hi" })).text;
    const product_nameInMalayalam = (await translatte(product_name, { to: "ml" })).text;

    const product_descriptionInArab = (await translatte(product_description, { to: "ar" })).text;
    const product_descriptionInFrench = (await translatte(product_description, { to: "fr" })).text;
    const product_descriptionInHindi = (await translatte(product_description, { to: "hi" })).text;
    const product_descriptionInMalayalam = (await translatte(product_description, { to: "ml" })).text;

    const translationsArray = [
      { lannum: 0, lancod: "en", langP: product_name, langD: product_description },
      { lannum: 1, lancod: "ar", langP: product_nameInArab, langD: product_descriptionInArab },
      { lannum: 2, lancod: "fr", langP: product_nameInFrench, langD: product_descriptionInFrench },
      { lannum: 3, lancod: "hi", langP: product_nameInHindi, langD: product_descriptionInHindi },
      { lannum: 4, lancod: "ml", langP: product_nameInMalayalam, langD: product_descriptionInMalayalam },
    ];

    // Delete old translations, product info and taxes
    await model.DeleteAllTranslations(product_id);
    await model.DeleteProductInfo(product_id);
    await model.DeleteProductTax(product_id);

    // Insert new translations
    for (const el of translationsArray) {
      await model.AddTranslatedProducts(product_id, el.lannum, el.langP, el.langD);
    }

    // Insert product info array if provided
    if (Array.isArray(infoArray)) {
      for (const infoObj of infoArray) {
        if (infoObj && infoObj.infoLabel && infoObj.infoValue) {
          await model.InsertProductInfo(product_id, infoObj.infoLabel, infoObj.infoValue);
        }
      }
    }

    // Insert tax schedule mappings
    if (Array.isArray(tax_value_ids)) {
      for (const taxId of tax_value_ids) {
        await model.InsertProductTax(product_id, taxId);
      }
    }

    // Update product flags/fields
    const updates = [];
    if (shipping !== undefined) updates.push(`shipping='${shipping}'`);
    if (cod !== undefined) updates.push(`cash_on_delivery='${cod}'`);
    if (refund !== undefined) updates.push(`refundable='${refund}'`);
    if (free_delivery !== undefined) updates.push(`free_delivery='${free_delivery}'`);
    if (new_arrival !== undefined) updates.push(`new_arrival='${new_arrival}'`);
    if (category !== undefined) updates.push(`category_id='${category}'`);

    if (updates.length > 0) {
      const updateString = updates.join(', ');
      const updated = await model.UpdateProduct(updateString, product_id);
      if (updated.affectedRows === 0) {
        return res.send({
          result: false,
          message: "Failed to update product",
        });
      }
    }

    return res.send({
      result: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message || "Server error",
    });
  }
};
module.exports.EditProductVariant = async (req, res) => {
  try {
    const formidable = require('formidable');
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.send({ result: false, message: 'File upload failed!', data: err });
      }

      const { product_variant_id } = fields;
      if (!product_variant_id) {
        return res.send({ result: false, message: 'Product variant ID is required' });
      }

      // Check variant exists
      const checkVariant = await model.CheckProductVariant(product_variant_id);
      if (checkVariant.length === 0) {
        return res.send({ result: false, message: 'Product variant not found' });
      }

      // Check if files to delete (not clear from your code, omitted for brevity)

      // Upload new images if any
      if (files.image) {
        const uploadDir = path.join(process.cwd(), 'uploads', 'product');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        const imageArray = Array.isArray(files.image) ? files.image : [files.image];

        for (let image of imageArray) {
          const oldPath = image.filepath;
          const newPath = path.join(uploadDir, image.originalFilename);
          try {
            const rawData = fs.readFileSync(oldPath);
            fs.writeFileSync(newPath, rawData);
            const imagePath = "/uploads/product/" + image.originalFilename;
            await model.AddVariantImages(product_variant_id, imagePath);
          } catch (err) {
            console.error('File save error:', err);
          }
        }
      }

      // Prepare update string
      const updates = [];
      if (fields.sku !== undefined) updates.push(`bpv_sku='${fields.sku}'`);
      if (fields.size !== undefined) updates.push(`bpv_size='${fields.size}'`);
      if (fields.unit !== undefined) updates.push(`bpv_unit='${fields.unit}'`);
      if (fields.stock !== undefined) updates.push(`bpv_stock='${fields.stock}'`);
      if (fields.price !== undefined) updates.push(`bpv_price='${fields.price}'`);
      if (fields.discount !== undefined) updates.push(`bpv_discount='${fields.discount}'`);

      if (updates.length > 0) {
        const updateStr = updates.join(', ');
        const result = await model.UpdateProductVariant(updateStr, product_variant_id);
        if (result.affectedRows === 0) {
          return res.send({ result: false, message: 'Update failed' });
        }
      }

      res.send({ result: true, message: 'Product variant updated successfully' });
    });
  } catch (err) {
    res.send({ result: false, message: err.message || 'Error' });
  }
};
module.exports.GetProductByIdWithDetails = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) {
      return res.status(400).send({ result: false, message: "Product ID is required" });
    }

    const rows = await model.GetProductByIdWithDetails(Number(product_id));

    if (!rows || rows.length === 0) {
      return res.status(404).send({ result: false, message: "Product not found" });
    }

    // Fetch tax ids and schedules separately
    const taxIds = await model.GetProductTaxIds(product_id);
    const taxSchedules = await model.GetTaxSchedulesByIds(taxIds);

    // Build response objects (taxSchedules will be an array)
    // Build product info and variants as before

    const productInfo = {
      product_id: rows[0].product_id,
      product_name: rows[0].product_name,
      description: rows[0].description,
      category_id: rows[0].category_id,
      sub_category_id: rows[0].sub_category_id,
      shipping: rows[0].shipping,
      cash_on_delivery: rows[0].cash_on_delivery,
      refundable: rows[0].refundable,
      free_delivery: rows[0].free_delivery,
      new_arrival: rows[0].new_arrival,
      tax_schedules: taxSchedules,
      variants: [],
      info: []
    };

    const variantsMap = new Map();
    const infoMap = new Map();

    for (const row of rows) {
      if (row.bpv_id && !variantsMap.has(row.bpv_id)) {
        variantsMap.set(row.bpv_id, {
          bpv_id: row.bpv_id,
          bpv_sku: row.bpv_sku,
          bpv_size: row.bpv_size,
          bpv_unit: row.bpv_unit,
          unit_name: row.unit_name,
          bpv_stock: row.bpv_stock,
          bpv_price: row.bpv_price,
          bpv_discount: row.bpv_discount,
          bpv_selling_price: row.bpv_selling_price,
          bpv_gst_price: row.bpv_gst_price,
          bpv_vat_price: row.bpv_vat_price,
          images: row.variant_images ? row.variant_images.split(",") : [],
        });
      }
      if (row.info_label && !infoMap.has(row.info_label)) {
        infoMap.set(row.info_label, {
          info_label: row.info_label,
          info_value: row.info_value,
        });
      }
    }

    productInfo.variants = Array.from(variantsMap.values());
    productInfo.info = Array.from(infoMap.values());

    return res.send({ result: true, data: productInfo });
  } catch (error) {
    return res.status(500).send({ result: false, message: error.message || "Server error" });
  }
};
module.exports.GetVariantsByProductId = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) {
      return res.send({
        result: false,
        message: "product_id parameter is required",
      });
    }

    const variants = await model.GetVariantsByProductId(Number(product_id));
    if (!variants || variants.length === 0) {
      return res.send({
        result: false,
        message: "No variants found for the given product_id",
      });
    }

    // Parse images string into arrays per variant
    const formattedVariants = variants.map(v => ({
      ...v,
      images: v.images ? v.images.split(',') : []
    }));

    return res.send({
      result: true,
      data: formattedVariants,
    });
  } catch (error) {
    return res.send({
      result: false,
      message: error.message,
    });
  }
};
// get variant by id
module.exports.GetVariantDetailsById = async (req, res) => {
  try {
    const { variant_id } = req.body;
    if (!variant_id) {
      return res.status(400).send({
        result: false,
        message: "variant_id parameter is required",
      });
    }

    const data = await model.GetVariantDetailsById(Number(variant_id));
    if (!data) {
      return res.status(404).send({
        result: false,
        message: "Variant not found",
      });
    }

    // Parse images from comma-separated to arrays
    data.variant_images = data.variant_images ? data.variant_images.split(",") : [];
    data.product_images = data.product_images ? data.product_images.split(",") : [];

    return res.send({
      result: true,
      data,
    });
  } catch (error) {
    return res.status(500).send({
      result: false,
      message: error.message || "Server error",
    });
  }
};