var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

// ✅ Check if user is admin
module.exports.CheckAdminQuery = async (user_id) => {
  const sql = `
    SELECT * 
    FROM bh_user 
    WHERE user_id = ? 
      AND user_status = 'active' 
      AND user_role = 'admin'
  `;
  const data = await query(sql, [user_id]);
  return data;
};

// ✅ Get banner by ID
module.exports.GetBannerById = async (banner_id) => {
  const sql = "SELECT * FROM bh_banner WHERE banner_id = ?";
  const data = await query(sql, [banner_id]);
  return data;
};

// ✅ Update banner by ID (similar to AddBanner insert style)
module.exports.UpdateBanner = async ({
  banner_id,
  banner_name,
  description,
  image_path,
  category_id = null,
  product_id = null,
  updated_by,
  updated_at,
}) => {
  if (!banner_id) throw new Error("banner_id is required");

  const cols = [];
  const params = [];

  if (banner_name !== undefined) {
    cols.push("banner_name = ?");
    params.push(banner_name);
  }
  if (description !== undefined) {
    cols.push("description = ?");
    params.push(description);
  }
  if (image_path !== undefined) {
    cols.push("banner_image = ?");
    params.push(image_path);
  }
  if (category_id !== undefined) {
    cols.push("category_id = ?");
    params.push(category_id === null ? null : Number(category_id));
  }
  if (product_id !== undefined) {
    cols.push("product_id = ?");
    params.push(product_id === null ? null : Number(product_id));
  }
  if (updated_by !== undefined) {
    cols.push("updated_by = ?");
    params.push(updated_by);
  }
  if (updated_at !== undefined) {
    cols.push("updated_at = ?");
    params.push(updated_at);
  }

  if (cols.length === 0) throw new Error("No fields provided to update");

  const sql = `
    UPDATE bh_banner 
    SET ${cols.join(", ")} 
    WHERE banner_id = ?
  `;
  params.push(banner_id);

  const result = await query(sql, params);
  return result;
};
// Insert banner (flexible fields)
module.exports.AddBanner = async ({
  banner_name,
  banner_heading,
  description,
  image_path,
  banner_priority = 0,
  category_id = null,
  product_id = null,
  created_by = null
}) => {
  try {
    const cols = [];
    const vals = [];
    const params = [];

    if (banner_name !== undefined) { cols.push('banner_name'); vals.push('?'); params.push(banner_name); }
    if (banner_heading !== undefined) { cols.push('banner_heading'); vals.push('?'); params.push(banner_heading); }
    if (description !== undefined) { cols.push('description'); vals.push('?'); params.push(description); }
    if (image_path !== undefined) { cols.push('banner_image'); vals.push('?'); params.push(image_path); }
    if (banner_priority !== undefined && banner_priority !== null) {
      cols.push('banner_priority'); vals.push('?'); params.push(Number(banner_priority));
    }
    if (category_id !== undefined) { cols.push('category_id'); vals.push('?'); params.push(category_id === null ? null : Number(category_id)); }
    if (product_id !== undefined) { cols.push('product_id'); vals.push('?'); params.push(product_id === null ? null : Number(product_id)); }
    if (created_by !== undefined) { cols.push('created_by'); vals.push('?'); params.push(created_by); }

    cols.push('created_at'); vals.push('NOW()');
    const sql = `
      INSERT INTO bh_banner (${cols.map(c => `\`${c}\``).join(', ')})
      VALUES (${vals.join(', ')})
    `;
    return await query(sql, params);
  } catch (err) {
    err.message = `AddBanner failed: ${err.message}`;
    throw err;
  }
};
