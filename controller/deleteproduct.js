var model = require("../model/deleteproduct")
var { languages } = require("../languages/languageFunc");

module.exports.DeleteProduct = async (req, res) => {
    try {
        const { user_id } = req?.user || req?.headers
        const { product_id, lang = 'en' } = req.body
        var language = await languages(lang);
        if (!product_id) {
            return res.send({
                result: false,
                message: "Product not found."
            })
        }
        let checkproduct = await model.CheckProduct(product_id);
        if (checkproduct.length === 0) {
            return res.send({
                result: false,
                message: language.Product_already_removed
            })
        }
        let deleted = await model.DeleteProduct(product_id);
        if (deleted.affectedRows > 0) {
            await model.DeleteAllVariantsOfProduct(product_id)
            return res.send({
                result: true,
                message: language.Product_removed_successfully
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete product"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteProductVariant = async (req, res) => {
    try {
        const { product_variant_id, lang = "en" } = req.body
        if (!product_variant_id) {
            return res.send({
                result: false,
                message: "Product variant id is required"
            })
        }
        const checkproductVariant = await model.CheckProductVariant(product_variant_id)
        if (checkproductVariant.length === 0) {
            return res.send({
                result: false,
                message: "Product variant data not found."
            })
        }
        const deleted = await model.DeleteSingleProductVariant(product_variant_id)
        if (deleted.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Product variant deleted successfully"
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete product variant"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}


module.exports.DeleteProductVariantImage = async (req, res) => {
    try {
        const { variant_image_id, lang = "en" } = req.body
        if (!variant_image_id) {
            return res.send({
                result: false,
                message: "Product variant image id is required"
            })
        }
        const checkImage = await model.CheckProductVariantImage(variant_image_id)
        if (checkImage.length === 0) {
            return res.send({
                result: false,
                message: "Product variant image not found."
            })
        }
        const deleted = await model.DeleteProductVariantImage(variant_image_id)
        if (deleted.affectedRows > 0) {
            return res.send({
                result: true,
                message: "Image deleted successfully."
            })
        } else {
            return res.send({
                result: false,
                message: "Failed to delete product image."
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}