var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckUserQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.CheckProduct = async (product_id) => {
    var Query = `select * from bh_products where product_id = ? and product_status = 'active'`;
    var data = query(Query, [product_id]);
    return data;
};


module.exports.DeleteProduct = async (product_id) => {
    try {
        const Query = `DELETE FROM bh_products WHERE product_id = ?`;
        const result = await query(Query, [product_id]);
        return result;
    } catch (err) {
        err.message = `DeleteProduct failed: ${err.message}`;
        throw err;
    }
};


module.exports.DeleteAllVariantsOfProduct = async (product_id) => {
    let Query = `delete from bh_product_variants where bpv_product_id=?`
    return await query(Query, [product_id])
}

module.exports.DeleteSingleProductVariant = async (variant_id) => {
    let Query = `delete from bh_product_variants where bpv_id=?`
    return await query(Query, [variant_id])
}

module.exports.DeleteProductVariantImage = async (variant_image_id) => {
    let Query = `delete from bh_product_variant_images where pv_id=?`
    return await query(Query, [variant_image_id])
}

module.exports.CheckProductVariant = async (variant_id) => {
    let Query = `select * from bh_product_variants where bpv_id=?`
    return await query(Query, [variant_id])
}


module.exports.CheckProductVariantImage = async (image_id) => {
    let Query = `select * from bh_product_variant_images where pv_id=?`
    return await query(Query, [image_id])
}