var db = require("../db/db");
var util = require("util")
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
    var Query = `select * from bh_user where user_id = ? and user_status = 'active' and user_role = 'admin'`;
    var data = query(Query, [user_id]);
    return data;
};

module.exports.CheckProductQuery = async (product_name) => {
    var Query = `select * from bh_product_translations where product_name = ? `;
    var data = query(Query, [product_name]);
    return data;
};

module.exports.AddProduct = async (category_id, quantity, shipping, cash_on_delivery, refundable, free_delivery, unit, date, product_id) => {
    let condition = ''
    if (category_id) {
        if (condition !== '') {
            condition += ` ,category_id = '${category_id}'`
        } else {
            condition = `set category_id = '${category_id}'`
        }
    }
    if (quantity) {
        if (condition !== '') {
            condition += ` ,quantity = '${quantity}'`
        } else {
            condition = `set quantity = '${quantity}'`
        }
    }
    if (shipping) {
        if (condition !== '') {
            condition += ` ,shipping = '${shipping}'`
        } else {
            condition = `set shipping = '${shipping}'`
        }
    }
    if (cash_on_delivery) {
        if (condition !== '') {
            condition += ` ,cash_on_delivery = '${cash_on_delivery}'`
        } else {
            condition = `set cash_on_delivery = '${cash_on_delivery}'`
        }
    }
    if (refundable) {
        if (condition !== '') {
            condition += ` ,refundable = '${refundable}'`
        } else {
            condition = `set refundable = '${refundable}'`
        }
    }
    if (free_delivery) {
        if (condition !== '') {
            condition += ` ,free_delivery = '${free_delivery}'`
        } else {
            condition = `set free_delivery = '${free_delivery}'`
        }
    }
    if (unit) {
        if (condition !== '') {
            condition += ` ,product_unit = '${unit}'`
        } else {
            condition = `set product_unit = '${unit}'`
        }
    }
    if (date) {
        if (condition !== '') {
            condition += ` ,updated_at = '${date}'`
        }
    }
    if (condition !== '') {
        condition += ` where product_id = '${product_id}' `
    }
    if (condition !== '') {

        var Query = `update bh_products ${condition}`
        // console.log(Query, "qkwndK'ASLDM'L,asc");
        var data = query(Query);
        return data;
    }
};

module.exports.GetProduct = async () => {
    var Query = `select product_id from bh_products order by product_id desc limit 1`;
    var data = query(Query);
    return data;
};


module.exports.AddProductStock = async (stock, product_id) => {
    var Query = `update bh_product_stock set stock_stock = ? where product_id = ?`;
    var data = query(Query, [stock, product_id]);
    return data;
};

module.exports.AddProductStockStatus = async (stock_status, product_id) => {
    var Query = `update bh_product_stock set stock_status = ? where product_id = ?`;
    var data = query(Query, [stock_status, product_id]);
    return data;
};

module.exports.AddProductImage = async (product_id, image, image_priority) => {
    var Query = `update bh_product_images set image_file = ? where product_id = ? and image_priority =?`;
    var data = query(Query, [image, product_id, image_priority]);
    return data;
};

module.exports.AddProductPrice = async (product_id, price) => {
    var Query = `update bh_product_prices set country_id = ?,price = ? where product_id = ?`;
    var data = query(Query, [1, price, product_id]);
    return data;
};

module.exports.SelectLanguageId = async (language_code) => {
    var Query = `select language_id,language_code from bh_languages where language_code = ?`;
    var data = query(Query, [language_code]);
    return data;
};

module.exports.AddTranslatedProducts = async (product_id, language_id, product_name, description) => {
    // console.log(product_id, language_id, product_name, description);
    let condition = ``
    if (product_name) {
        if (condition !== '') {
            condition += `, product_name = "${product_name}"`
        } else {
            condition = ` set product_name = "${product_name}"`

        }
    }
    if (description) {
        if (condition !== '') {
            condition += `, description = "${description}"`
        } else {
            condition = ` set description = "${description}"`
        }
    }
    var Query = `update bh_product_translations ${condition} where product_id = ? and language_id = ?`;
    // console.log(Query);
    
    var data = query(Query, [product_id, language_id]);
    return data;
};
