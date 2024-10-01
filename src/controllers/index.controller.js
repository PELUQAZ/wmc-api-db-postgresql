import { pool } from "../db.js";

export const getUsers = async (req, res) => {
  const response = await pool.query("SELECT * FROM usuarios_wmc ORDER BY id ASC");
  res.status(200).json(response.rows);
};

export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await pool.query("SELECT * FROM usuarios_wmc WHERE id = $1", [id]);
  res.json(response.rows);
};

//Crear usuario
export const createUser = async (req, res) => {
  try {
    const { nombre_completo, email, direccion_wallet, pais, reputacion, wun_balance, rol_usuario, estado, datos_adicionales, hash_smart_contracts} = req.body;
    const { rows } = await pool.query(
      "INSERT INTO usuarios_wmc (nombre_completo, email, direccion_wallet, pais, reputacion, wun_balance, rol_usuario, estado, datos_adicionales, hash_smart_contracts)" + 
      " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [nombre_completo, email, direccion_wallet, pais, reputacion, wun_balance, rol_usuario, estado, datos_adicionales, hash_smart_contracts]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre_completo, email, direccion_wallet, pais, reputacion, wun_balance, rol_usuario, estado, datos_adicionales, hash_smart_contracts } = req.body;

  const { rows } = await pool.query(
    "UPDATE usuarios_wmc SET nombre_completo = $1, email = $2, direccion_wallet = $3, pais = $4, reputacion = $5, wun_balance = $6, " + 
      "rol_usuario = $7, estado = $8, datos_adicionales = $9, hash_smart_contracts = $10 " + 
    "WHERE id = $11 RETURNING *",
    [nombre_completo, email, direccion_wallet, pais, reputacion, wun_balance, rol_usuario, estado, datos_adicionales, hash_smart_contracts, id]
  );

  return res.json(rows[0]);
};

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { rowCount } = await pool.query("DELETE FROM usuarios_wmc where id = $1", 
    [id,]
  );
  if (rowCount === 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  return res.sendStatus(204);
};
