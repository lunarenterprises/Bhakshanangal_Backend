var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
  try {
    const Query = `select * from bh_user where user_id = ? and user_status = 'active' and user_role = 'admin'`;
    const data = await query(Query, [user_id]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.CheckProductQuery = async (product_name) => {
  try {
    const Query = `select * from bh_product_translations p
    inner join bh_products r on p.product_id = r.product_id
  where p.product_name = ? and r.product_status = 'active'`;
    const data = await query(Query, [product_name]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.CheckCategory = async (category_id) => {
  try {
    let Query = `select * from bh_product_categories where category_id=?`
    return await query(Query, [category_id])
  } catch (error) {
    throw error;
  }
}

module.exports.CheckSubCategory = async (sub_category) => {
  try {
    let Query = `select * from bh_product_sub_categories where sc_id=?`
    return await query(Query, [sub_category])
  } catch (error) {
    throw error;
  }
}

module.exports.CheckTax = async (tax_value_id) => {
  try {
    let Query = `select * from tax_schedule where tx_schedule_id=?`
    return await query(Query, [tax_value_id])
  } catch (error) {
    throw error;
  }
}

module.exports.AddProduct = async (
  category_id,
  sub_category,
  shipping,
  cash_on_delivery,
  refundable,
  free_delivery,
  new_arrival
) => {
  try {
    const Query = `INSERT INTO bh_products(category_id, sub_category_id, shipping, cash_on_delivery, refundable, free_delivery, new_arrival) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const data = await query(Query, [
      category_id,
      sub_category,
      shipping,
      cash_on_delivery,
      refundable,
      free_delivery,
      new_arrival
    ]);
    return data;
  } catch (error) {
    throw error;
  }
};
// Insert into bh_product_tax
module.exports.InsertProductTax = async (product_id, tax_value_id) => {
  try {
    const sql = `INSERT INTO bh_product_tax (product_id, tax_value_id) VALUES (?, ?)`;
    return await query(sql, [product_id, tax_value_id]);
  } catch (err) {
    err.message = `InsertProductTax failed: ${err.message}`;
    throw err;
  }
};
module.exports.GetTaxDetailsById = async (tax_value_id) => {
  try {
    const sql = `
      SELECT 
        tx_schedule_id,
        tx_schedule_name,
        tx_schedule_tax,
        tx_schedule_cgst,
        tx_schedule_igst,
        tx_schedule_sgst,
        tx_schedule_vat
      FROM tax_schedule
      WHERE tx_schedule_id = ?
      LIMIT 1
    `;
    const rows = await query(sql, [tax_value_id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    err.message = `GetTaxDetailsById failed: ${err.message}`;
    throw err;
  }
};

// Insert into bh_product_info
module.exports.InsertProductInfo = async (product_id, infoLabel, info) => {
  try {
    const sql = `INSERT INTO bh_product_info (product_id, info_label, info_value) VALUES (?, ?, ?)`;
    return await query(sql, [product_id, infoLabel, info]);
  } catch (err) {
    err.message = `InsertProductInfo failed: ${err.message}`;
    throw err;
  }
};

module.exports.GetProduct = async () => {
  try {
    const Query = `select product_id from bh_products order by product_id desc limit 1`;
    const data = await query(Query);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.AddProductStock = async (stock, product_id) => {
  try {
    const Query = `insert into bh_product_stock(stock_stock,product_id,stock_status)values(?,?,?)`;
    const data = await query(Query, [stock, product_id, 'instock']);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.AddProductImage = async (product_id, image, image_priority) => {
  try {
    const Query = `insert into bh_product_images(product_id,image_file,image_priority)values(?,?,?)`;
    const data = await query(Query, [product_id, image, image_priority]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.AddProductPrice = async (product_id, price) => {
  try {
    const Query = `insert into bh_product_prices(product_id,country_id,price)values(?,?,?)`;
    const data = await query(Query, [product_id, 1, price]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.SelectLanguageId = async (language_code) => {
  try {
    const Query = `select language_id,language_code from bh_languages where language_code = ?`;
    const data = await query(Query, [language_code]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.AddTranslatedProducts = async (
  product_id,
  language_id,
  product_name,
  description,
  material, how_to_use
) => {
  try {
    const Query = `insert into bh_product_translations(product_id,language_id,product_name,description,material,how_to_use)values(?,?,?,?,?,?)`;
    const data = await query(Query, [
      product_id,
      language_id,
      product_name,
      description,
      material, how_to_use
    ]);
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports.CheckProductWithId = async (product_id) => {
  try {
    let Query = `select * from bh_products where product_id=?`
    return await query(Query, [product_id])
  } catch (error) {
    throw error;
  }
}
// Add a new product variant with all fields
module.exports.AddProductVariant = async (
  product_id,
  sku,
  size,
  unit,
  stock,
  price,
  discount,
  selling_price,
  gst_price,
  vat_price
) => {
  try {
    const sql = `
      INSERT INTO bh_product_variants
      (bpv_product_id, bpv_sku, bpv_size, bpv_unit, bpv_stock, bpv_price, bpv_discount, bpv_selling_price, bpv_gst_price, bpv_vat_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return await query(sql, [
      product_id,
      sku,
      size,
      unit,
      stock,
      price,
      discount,
      selling_price,
      gst_price,
      vat_price
    ]);
  } catch (error) {
    throw error;
  }
};
module.exports.UpdateProductVariant = async (updateString, variant_id) => {
  try {
    let Query = `update bh_product_variants SET ${updateString} WHERE bpv_id=?`
    return await query(Query, [variant_id])
  } catch (error) {
    throw error;
  }
}
module.exports.AddVariantImages = async (variant_id, filepath) => {
  try {
    let Query = `insert into bh_product_variant_images (pv_variant_id,pv_file) values(?,?)`
    return await query(Query, [variant_id, filepath])
  } catch (error) {
    throw error;
  }
}
module.exports.GetProductTranslation = async (product_id) => {
  try {
    let Query = `
          SELECT t.*, l.language_name, l.language_code
          FROM bh_product_translations t
          JOIN bh_languages l 
            ON l.language_id = t.language_id
          WHERE t.product_id = ?
      `;
    return await query(Query, [product_id]);
  } catch (error) {
    throw error;
  }
}
module.exports.UpdateProduct = async (updateString, product_id) => {
  try {
    let Query = `update bh_products SET ${updateString} WHERE product_id=?`
    return await query(Query, [product_id])
  } catch (error) {
    throw error;
  }
}
module.exports.DeleteAllTranslations = async (product_id) => {
  try {
    let Query = `delete from bh_product_translations where product_id=?`
    return await query(Query, [product_id])
  } catch (error) {
    throw error;
  }
}
// Delete all product info entries
module.exports.DeleteProductInfo = async (product_id) => {
  try {
    const sql = `DELETE FROM bh_product_info WHERE product_id = ?`;
    return await query(sql, [product_id]);
  } catch (error) {
    error.message = `DeleteProductInfo failed: ${error.message}`;
    throw error;
  }
};

// Delete all tax schedule mappings for product
module.exports.DeleteProductTax = async (product_id) => {
  try {
    const sql = `DELETE FROM bh_product_tax WHERE product_id = ?`;
    return await query(sql, [product_id]);
  } catch (error) {
    error.message = `DeleteProductTax failed: ${error.message}`;
    throw error;
  }
};

module.exports.CheckProductVariant = async (variant_id) => {
  try {
    let Query = `select * from bh_product_variants where bpv_id=?`
    return await query(Query, [variant_id])
  } catch (error) {
    throw error;
  }
}
module.exports.GetProductVariantImages = async (variant_id) => {
  try {
    let Query = `select * from bh_product_variant_images where pv_variant_id=?`
    return await query(Query, [variant_id])
  } catch (error) {
    throw error;
  }
}
module.exports.DeleteFilesQuery = async (user_id, fileKeys) => {
  try {
    var Query = `delete from bh_product_variant_images where pv_variant_id =? and pv_id not in (${fileKeys})`;
    var data = await query(Query, [user_id, fileKeys]);
    return data;
  } catch (error) {
    throw error;
  }
}
module.exports.DeleteAllUserFilesQuery = async (variant_id) => {
  try {
    var Query = `delete from bh_product_variant_images where pv_variant_id=? `;
    var data = await query(Query, [variant_id]);
    return data;
  } catch (error) {
    throw error;
  }
}
module.exports.GetVariantsByProductId = async (product_id) => {
  try {
    const sql = `
     SELECT 
  pv.bpv_id,
  pv.bpv_product_id,
  pv.bpv_sku,
  pv.bpv_size,
  pv.bpv_unit,
  pv.bpv_stock,
  pv.bpv_price,
  pv.bpv_discount,
  pv.bpv_selling_price,
  pv.bpv_gst_price,
  pv.bpv_vat_price,
  u.unit_name,
  GROUP_CONCAT(pvi.pv_file) AS images
FROM bh_product_variants pv
LEFT JOIN bh_product_variant_images pvi ON pv.bpv_id = pvi.pv_variant_id
LEFT JOIN units u ON pv.bpv_unit = u.unit_id  
WHERE pv.bpv_product_id = ?
GROUP BY pv.bpv_id
ORDER BY pv.bpv_id DESC;

    `;
    const rows = await query(sql, [product_id]);
    return rows;
  } catch (err) {
    err.message = `GetVariantsByProductId failed: ${err.message}`;
    throw err;
  }
};
module.exports.GetProductByIdWithDetails = async (product_id) => {
  try {
    const sql = `
      SELECT 
        t.product_name,
        t.description,
        p.product_id,
        p.category_id,
        p.sub_category_id,
        p.shipping,
        p.cash_on_delivery,
        p.refundable,
        p.free_delivery,
        p.new_arrival,
        pv.bpv_id,
        pv.bpv_sku,
        pv.bpv_size,
        pv.bpv_unit,
        u.unit_name,
        pv.bpv_stock,
        pv.bpv_price,
        pv.bpv_discount,
        pv.bpv_selling_price,
        pv.bpv_gst_price,
        pv.bpv_vat_price,
        GROUP_CONCAT(DISTINCT pvi.pv_file) AS variant_images,
        pi.info_label,
        pi.info_value
      FROM bh_products p
      LEFT JOIN bh_product_translations t ON p.product_id = t.product_id
      LEFT JOIN bh_product_tax pt ON p.product_id = pt.product_id
      LEFT JOIN bh_product_variants pv ON p.product_id = pv.bpv_product_id
      LEFT JOIN bh_product_variant_images pvi ON pv.bpv_id = pvi.pv_variant_id
      LEFT JOIN units u ON pv.bpv_unit = u.unit_id
      LEFT JOIN bh_product_info pi ON p.product_id = pi.product_id
      WHERE p.product_id = ?
      GROUP BY p.product_id, pv.bpv_id, pi.id
      ORDER BY pv.bpv_id DESC
    `;
    const rows = await query(sql, [product_id]);
    return rows;
  } catch (err) {
    err.message = `GetProductByIdWithDetails failed: ${err.message}`;
    throw err;
  }
};
// Get tax schedule ids linked to product
module.exports.GetProductTaxIds = async (product_id) => {
  try {
    const sql = `SELECT tax_value_id FROM bh_product_tax WHERE product_id = ?`;
    const rows = await query(sql, [product_id]);
    return rows.map(r => r.tax_value_id);
  } catch (err) {
    err.message = `GetProductTaxIds failed: ${err.message}`;
    throw err;
  }
};

// Get full tax schedules by array of tax_value_ids
module.exports.GetTaxSchedulesByIds = async (taxIds) => {
  try {
    if (!taxIds || taxIds.length === 0) return [];
    const placeholders = taxIds.map(() => '?').join(',');
    const sql = `
      SELECT 
        tx_schedule_id,
        tx_schedule_name,
        tx_schedule_tax,
        tx_schedule_cgst,
        tx_schedule_igst,
        tx_schedule_sgst,
        tx_schedule_vat
      FROM tax_schedule
      WHERE tx_schedule_id IN (${placeholders})
    `;
    return await query(sql, taxIds);
  } catch (err) {
    err.message = `GetTaxSchedulesByIds failed: ${err.message}`;
    throw err;
  }
};
// product variants by  id
module.exports.GetVariantDetailsById = async (variant_id) => {
  try {
    const sql = `
      SELECT 
        pv.bpv_id,
        pv.bpv_product_id,
        pv.bpv_sku,
        pv.bpv_size,
        pv.bpv_unit,
        u.unit_name,
        pv.bpv_stock,
        pv.bpv_price,
        pv.bpv_discount,
        pv.bpv_selling_price,
        pv.bpv_gst_price,
        pv.bpv_vat_price,
        p.category_id,
        p.sub_category_id,
        p.shipping,
        p.cash_on_delivery,
        p.refundable,
        p.free_delivery,
        p.new_arrival,
        ts.tx_schedule_id,
        ts.tx_schedule_name,
        ts.tx_schedule_tax,
        ts.tx_schedule_cgst,
        ts.tx_schedule_igst,
        ts.tx_schedule_sgst,
        ts.tx_schedule_vat,
        GROUP_CONCAT(DISTINCT pvi.pv_file) AS variant_images   
      FROM bh_product_variants pv
      LEFT JOIN units u ON pv.bpv_unit = u.unit_id
      LEFT JOIN bh_products p ON pv.bpv_product_id = p.product_id
      LEFT JOIN bh_product_tax pt ON p.product_id = pt.product_id
      LEFT JOIN tax_schedule ts ON pt.tax_value_id = ts.tx_schedule_id
      LEFT JOIN bh_product_variant_images pvi ON pv.bpv_id = pvi.pv_variant_id
      LEFT JOIN bh_product_images pi ON p.product_id = pi.product_id
      WHERE pv.bpv_id = ?
      GROUP BY pv.bpv_id
      LIMIT 1
    `;
    const rows = await query(sql, [variant_id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    err.message = `GetVariantDetailsById failed: ${err.message}`;
    throw err;
  }
};