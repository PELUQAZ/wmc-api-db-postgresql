import {
    API_KEY,
} from "../config.js";

const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    console.log("apiKey = ", apiKey);    
    console.log("API_KEY = ", API_KEY);
    const validApiKey = API_KEY;

    // Verifica si la API_KEY está definida
    if (!validApiKey) {
        console.error("API KEY no está configurada en las variables de entorno.");
        return res.status(500).json({ message: "Server configuration error: API KEY not set" });
    }
    if (apiKey && apiKey === validApiKey) {
        next(); // Continúa si la API Key es válida
    } else {
        res.status(401).json({ message: 'Unauthorized' }); // Devuelve error si no es válida
    }
};

export default validateApiKey;