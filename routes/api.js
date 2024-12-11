const express = require('express');
const router = express.Router();
const db = require('../config/db');
const validateUser = require('../middleware/validateUser');
const validateProduct = require('../middleware/validateProduct');

// User Registration Endpoint
router.post('/register-user', async (req, res, next) => {
    const { username, mob_num, city, state, country } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO user_details (username, mob_num, city, state, country) VALUES (?, ?, ?, ?, ?)',
            [username, mob_num, city, state, country]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (err) {
        next(err);
    }
});

// Product Registration Endpoint
router.post('/register-product', async (req, res, next) => {
    const { product_name, product_quantity, product_price } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO product_details (product_name, product_quantity, product_price) VALUES (?, ?, ?)',
            [product_name, product_quantity, product_price]
        );
        res.status(201).json({ message: 'Product registered successfully', productId: result.insertId });
    } catch (err) {
        next(err);
    }
});

// Purchase Endpoint with Middleware
router.post('/purchase', validateUser, validateProduct, async (req, res, next) => {
    const { user_id, product_id, purchase_quantity } = req.body;
    const { user } = req;
    const { product } = req;

    try {
        // Insert purchase record
        await db.query(
            'INSERT INTO purchase_details (user_id, product_id, user_name, product_name, purchase_quantity) VALUES (?, ?, ?, ?, ?)',
            [user_id, product_id, user.username, product.product_name, purchase_quantity]
        );

        // Update product quantity
        await db.query(
            'UPDATE product_details SET product_quantity = product_quantity - ? WHERE id = ?',
            [purchase_quantity, product_id]
        );

        res.status(201).json({ message: 'Purchase recorded successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
