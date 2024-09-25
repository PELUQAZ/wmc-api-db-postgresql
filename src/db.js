import pg from "pg";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "./config.js";

export const pool = new pg.Pool({
  user: "wmcadmin", //DB_USER,
  host: "wmc-db.postgres.database.azure.com", //DB_HOST,
  password: "WorkMarketCap2024*.", //DB_PASSWORD,
  database: "wmc_db", //DB_DATABASE,
  port: "5432", //DB_PORT,
  ssl: {
    rejectUnauthorized: false  // Permite conexiones SSL, aunque no verifique el certificado
  }
});
