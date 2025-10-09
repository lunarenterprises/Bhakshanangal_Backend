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
  sub_category, tax_value_id,
  shipping,
  cash_on_delivery,
  refundable,
  free_delivery,
  new_arrival
) => {
  try {
    const Query = `insert into bh_products(category_id,sub_category_id,tax_value_id,shipping,cash_on_delivery,refundable,free_delivery,new_arrival)values(?,?,?,?,?,?,?,?)`;
    const data = await query(Query, [
      category_id,
      sub_category, tax_value_id,
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

module.exports.AddProductVariant = async (product_id, sku, size, unit, stock, price, discount) => {
  try {
    let Query = `insert into bh_product_variants (bpv_product_id,bpv_sku,bpv_size,bpv_unit,bpv_stock,bpv_price,bpv_discount) values(?,?,?,?,?,?,?)`
    return await query(Query, [product_id, sku, size, unit, stock, price, discount])
  } catch (error) {
    throw error;
  }
}

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