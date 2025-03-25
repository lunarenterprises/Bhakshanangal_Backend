var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

module.exports.CheckAdminQuery = async (user_id) => {
  var Query = `select * from bh_user where user_id = ? and user_status = 'active' and user_role = 'admin'`;
  var data = query(Query, [user_id]);
  return data;
};

module.exports.CheckProductQuery = async (product_name) => {
  var Query = `select * from bh_product_translations p
  inner join bh_products r on p.product_id = r.product_id
where p.product_name = ? and r.product_status = 'active'`;
  var data = query(Query, [product_name]);
  return data;
};

module.exports.AddProduct = async (
  category_id,
  quantity,
  shipping,
  cash_on_delivery,
  refundable,
  free_delivery,
  unit,
  date
) => {
  var Query = `insert into bh_products(category_id,quantity,shipping,cash_on_delivery,refundable,free_delivery,product_unit,created_at)values(?,?,?,?,?,?,?,?)`;
  var data = query(Query, [
    category_id,
    quantity,
    shipping,
    cash_on_delivery,
    refundable,
    free_delivery,
    unit,
    date
  ]);
  return data;
};

module.exports.GetProduct = async () => {
  var Query = `select product_id from bh_products order by product_id desc limit 1`;
  var data = query(Query);
  return data;
};

module.exports.AddProductStock = async (stock, product_id) => {
  var Query = `insert into bh_product_stock(stock_stock,product_id,stock_status)values(?,?,?)`;
  var data = query(Query, [stock, product_id,'instock']);
  return data;
};

module.exports.AddProductImage = async (product_id, image, image_priority) => {
  var Query = `insert into bh_product_images(product_id,image_file,image_priority)values(?,?,?)`;
  var data = query(Query, [product_id, image, image_priority]);
  return data;
};

module.exports.AddProductPrice = async (product_id, price) => {
  var Query = `insert into bh_product_prices(product_id,country_id,price)values(?,?,?)`;
  var data = query(Query, [product_id, 1, price]);
  return data;
};

module.exports.SelectLanguageId = async (language_code) => {
  var Query = `select language_id,language_code from bh_languages where language_code = ?`;
  var data = query(Query, [language_code]);
  return data;
};

module.exports.AddTranslatedProducts = async (
  product_id,
  language_id,
  product_name,
  description
) => {
  var Query = `insert into bh_product_translations(product_id,language_id,product_name,description)values(?,?,?,?)`;
  var data = query(Query, [
    product_id,
    language_id,
    product_name,
    description,
  ]);
  return data;
};
