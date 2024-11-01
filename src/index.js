import express from "express";
import cors from 'cors';
import usersRoutes from "./routes/users.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import morgan from "morgan";
import { PORT } from "./config.js";
import validateApiKey from './middleware/validApiKey.js';

const app = express();

// Aplica el middleware a todas las rutas
app.use(validateApiKey);

app.use(cors());
//app.use(cors({ origin: 'https://workmarketcap.myshopify.com/' }));
app.use(cors({ origin: ['https://workmarketcap.myshopify.com', 'https://workmarketcap.myshopify.com/'] }));

app.use(morgan("dev"));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(usersRoutes);
app.use(servicesRoutes)

app.listen(PORT);
// eslint-disable-next-line no-console
console.log("Server on port", PORT);
