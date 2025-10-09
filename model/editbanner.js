var db = require("../db/db");
var util = require("util");
const query = util.promisify(db.query).bind(db);

// ✅ Check if user is admin
module.exports.CheckAdminQuery = async (user_id) => {
  if (!user_id) return [];

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

// ✅ Update banner by ID
module.exports.UpdateBanner = async ({
  banner_id,
  banner_name,
  description,
  image_path,
  category_id,
  product_id,
  updated_by,
  updated_at,
}) => {
  if (!banner_id) throw new Error("banner_id is required for update");

  const updates = [];
  const params = [];

  if (banner_name !== undefined) {
    updates.push("banner_name = ?");
    params.push(banner_name);
  }
  if (description !== undefined) {
    updates.push("description = ?");
    params.push(description);
  }
  if (image_path !== undefined) {
    updates.push("banner_image = ?");
    params.push(image_path);
  }
  if (category_id !== undefined) {
    updates.push("category_id = ?");
    params.push(category_id === null ? null : Number(category_id));
  }
  if (product_id !== undefined) {
    updates.push("product_id = ?");
    params.push(product_id === null ? null : Number(product_id));
  }
  if (updated_by !== undefined) {
    updates.push("updated_by = ?");
    params.push(updated_by);
  }
  if (updated_at !== undefined) {
    updates.push("updated_at = ?");
    params.push(updated_at);
  }

  if (updates.length === 0) throw new Error("No fields provided to update");

  const sql = `
    UPDATE bh_banner 
    SET ${updates.join(", ")} 
    WHERE banner_id = ?
  `;
  params.push(banner_id);

  const result = await query(sql, params);
  return result;
};
