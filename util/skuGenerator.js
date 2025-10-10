// Helper to generate random alphanumeric string of given length
const generateRandomString = (length = 5) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// In your controller, after validating product_id and before adding variant
const generateSku = (product_id) => {
    const timestamp = Date.now().toString().slice(-5); // last 5 digits of timestamp
    const randomStr = generateRandomString(4);
    return `SKU-${product_id}-${timestamp}${randomStr}`;
};
module.exports = { generateSku };