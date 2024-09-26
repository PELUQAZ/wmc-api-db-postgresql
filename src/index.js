import express from "express";
import usersRoutes from "./routes/users.routes.js";
import morgan from "morgan";
import { PORT } from "./config.js";

const app = express();

app.use(morgan("dev"));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//////////////////////////
/*app.use((err, req, res, next) => {
    console.error(err.stack);  // Imprime el stack trace en la consola (log)
    res.status(500).json({
      status: 'error',
      message: err.message,
      stack: process.env.NODE_ENV === 'prd' ? '🥞' : 'ERROR LVM:' + err.stack  // Mostrar el stack trace solo si NO es producción
    });
  });*/
//////////////////////////

app.use(usersRoutes);

app.listen(PORT);
// eslint-disable-next-line no-console
console.log("Server on port", PORT);
