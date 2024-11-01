//require('dotenv').config();

const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;

    if (apiKey && apiKey === validApiKey) {
        next(); // API Key válida
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

export default validateApiKey;
