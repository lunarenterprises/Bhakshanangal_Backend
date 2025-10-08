var model = require("../model/ListProduct");
var { languages } = require("../languages/languageFunc");
module.exports.ListAllProduct = async (req, res) => {
  try {
    // Make role and user_id optional-safe
    const role = (req.user && req.user.role) ? req.user.role : null;
    const user_id = (req.user && req.user.user_id) ? req.user.user_id : null;

    const {
      category_id,
      sub_category_id,
      lang = "en",
      search = "",
      page = 1,
      limit = 20
    } = req.body;

    const pageNum = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 20;
    const offset = (pageNum - 1) * pageLimit;

    // Map role to a safe status visibility
    // End-users (logged-in shoppers) see only active; others see all
    let statusKey = 'all';
    if (role === 'user') statusKey = 'active';

    // Total count with same filters but without LIMIT/OFFSET
    const totalRows = await model.GetAllProductsCount({
      category_id,
      sub_category_id,
      search,
      lang,
      statusKey
    });

    // Fetch paginated products with same filters
    const products = await model.GetAllProducts({
      category_id,
      sub_category_id,
      search,
      page: pageNum,
      limit: pageLimit,
      offset,
      lang,
      statusKey
    });

    const totalCount = totalRows?.[0]?.total || 0;
    const totalPage = Math.ceil(totalCount / pageLimit);

    const productData = await Promise.all(
      products.map(async (product) => {
        // Variants
        const variants = await model.GetProductVariants(product?.product_id);

        // Translations
        const translations = await model.GetProductTranslation(product?.product_id);
        const translationData = translations.find(item => item.language_code === lang);

        // Wishlist check (skip if user not logged in)
        let wishlist = false;
        if (user_id) {
          const wishlistcheck = await model.Getwishlist(user_id, product.product_id);
          wishlist = wishlistcheck.length > 0;
        }

        // Default names
        let categoryName = product.category_name;
        let subcategoryName = product.sub_category_name;

        // Category & subcategory translations
        if (product.category_id) {
          const categoryTranslations = await model.GetCategoryTranslation(product.category_id);
          const subcategoryTranslations = await model.GetSubCategoryTranslation(product.sub_category_id);

          const categoryTranslationData = categoryTranslations.find(item => item.language_code === lang);
          if (categoryTranslationData?.ct_language_name) {
            categoryName = categoryTranslationData.ct_language_name;
          }

          const subcategoryTranslationData = subcategoryTranslations.find(item => item.language_code === lang);
          if (subcategoryTranslationData?.sct_language_name) {
            subcategoryName = subcategoryTranslationData.sct_language_name;
          }
        }

        return {
          ...product,
          category_name: categoryName,
          sub_category_name: subcategoryName,
          product_name: translationData?.product_name || product.product_name,
          description: translationData?.description || product.description,
          material: translationData?.material || product.material,
          how_to_use: translationData?.how_to_use || product.how_to_use,
          wishlist,
          variants: variants.map((variant) => ({
            ...variant,
            images: JSON.parse(variant.images),
          }))
        };
      })
    );

    return res.send({
      result: true,
      message: "Data retrieved successfully",
      page: pageNum,
      limit: pageLimit,
      totalPage,
      data: productData
    });

  } catch (error) {
    console.error("ListAllProduct Error:", error);
    return res.send({
      result: false,
      message: error.message
    });
  }
};

module.exports.ViewProduct = async (req, res) => {
  try {
    const { product_id, lang = 'en' } = req.body
    if (!product_id) {
      return res.send({
        result: false,
        message: "Product id is required"
      })
    }
    const checkProduct = await model.GetProductById(product_id)
    const variants = await model.GetProductVariants(product_id)
    const translations = await model.GetProductTranslation(product_id)
    const translationData = translations.find(item => item.language_code === lang);
    if (checkProduct.length === 0) {
      return res.send({
        result: false,
        message: "Product not found."
      })
    }
    return res.send({
      result: true,
      message: "Data retrieved successfully",
      data: {
        ...checkProduct[0],
        product_name: translationData?.product_name,
        description: translationData?.description,
        variants: variants.map((variant) => ({
          ...variant,
          images: JSON.parse(variant.images)
        }))
      }
    })
  } catch (error) {
    return res.send({
      result: false,
      message: error.message
    })
  }
}