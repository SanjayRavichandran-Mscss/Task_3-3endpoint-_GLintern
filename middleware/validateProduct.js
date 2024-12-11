const db = require('../config/db');

const validateProduct = async (req, res, next) => {
    const { product_id, purchase_quantity } = req.body;

    try {
        const [[product]] = await db.query('SELECT * FROM product_details WHERE id = ?', [product_id]);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.product_quantity < purchase_quantity) {
            return res.status(400).json({ message: 'Insufficient product quantity' });
        }

        req.product = product; // Pass product data to the next middleware
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = validateProduct;
