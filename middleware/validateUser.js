const db = require('../config/db');

const validateUser = async (req, res, next) => {
    const { user_id } = req.body;

    try {
        const [[user]] = await db.query('SELECT * FROM user_details WHERE id = ?', [user_id]);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; // Pass user data to the next middleware
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = validateUser;
