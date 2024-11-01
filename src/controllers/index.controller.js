import { pool } from "../db.js";

// #region Usuarios 

export const getUsers = async (req, res) => {
  const response = await pool.query("SELECT * FROM usuarios_wmc ORDER BY id ASC");
  res.status(200).json(response.rows);
};

export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await pool.query("SELECT * FROM usuarios_wmc WHERE id = $1", [id]);
  res.json(response.rows);
};

export const getUserByWallet = async (req, res) => {
  const wallet = req.params.direccion_wallet;
  //console.log("wallet = ", req.params.direccion_wallet);
  //console.log("id = ", req.params.id);
  const response = await pool.query("SELECT * FROM usuarios_wmc WHERE direccion_wallet = $1", [wallet]);
  res.json(response.rows);
};

//Crear usuario
export const createUser = async (req, res) => {
  try {
    const { nombre_completo, email, direccion_wallet, pais, reputacion, wun_balance, rol_usuario, estado, datos_adicionales, hash_smart_contracts } = req.body;
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

export const updateUserByWallet = async (req, res) => {
  const direccion_wallet = req.params.direccion_wallet;
  const { nombre_completo, email, pais, reputacion, wun_balance, rol_usuario, estado, datos_adicionales, hash_smart_contracts } = req.body;

  try {
    const { rows } = await pool.query(
      "UPDATE usuarios_wmc SET nombre_completo = $1, email = $2, pais = $3, reputacion = $4, wun_balance = $5, " +
      "rol_usuario = $6, estado = $7, datos_adicionales = $8, hash_smart_contracts = $9 " +
      "WHERE direccion_wallet = $10 RETURNING *",
      [nombre_completo, email, pais, reputacion, wun_balance, rol_usuario, estado, datos_adicionales, hash_smart_contracts, direccion_wallet]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(rows[0]);

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(500).json({ message: "Error al actualizar usuario" });
  }

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

// #endregion Usuarios

// #region Servicios 

export const getServices = async (req, res) => {
  const response = await pool.query("SELECT * FROM servicios_wmc ORDER BY id ASC");
  res.status(200).json(response.rows);
};

export const getServiceById = async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await pool.query("SELECT * FROM servicios_wmc WHERE id = $1", [id]);
  res.json(response.rows);
};

//Crear servicio
export const createService = async (req, res) => {
  try {
    const { colaborador_id, titulo_servicio, descripcion, categoria, bolsa_horas, tarifa_hora, fecha_inicio, fecha_fin, estado, reputacion_minima, hash_smart_contracts, datos_adicionales } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO servicios_wmc (colaborador_id, titulo_servicio, descripcion, categoria, bolsa_horas, tarifa_hora, fecha_inicio, fecha_fin, estado, reputacion_minima, hash_smart_contracts, datos_adicionales)" +
      " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
      [colaborador_id, titulo_servicio, descripcion, categoria, bolsa_horas, tarifa_hora, fecha_inicio, fecha_fin, estado, reputacion_minima, hash_smart_contracts, datos_adicionales]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateService = async (req, res) => {
  const id = parseInt(req.params.id);
  const { colaborador_id, titulo_servicio, descripcion, categoria, bolsa_horas, tarifa_hora, fecha_inicio, fecha_fin, estado, reputacion_minima, hash_smart_contracts, datos_adicionales } = req.body;

  const { rows } = await pool.query(
    "UPDATE usuarios_wmc SET colaborador_id = $1, titulo_servicio = $2, descripcion = $3, categoria = $4, bolsa_horas = $5, tarifa_hora = $6, " +
    "fecha_inicio = $7, fecha_fin = $8, estado = $9, reputacion_minima = $10, hash_smart_contracts = $11, datos_adicionales = $12 " +
    "WHERE id = $13 RETURNING *",
    [colaborador_id, titulo_servicio, descripcion, categoria, bolsa_horas, tarifa_hora, fecha_inicio, fecha_fin, estado, reputacion_minima, hash_smart_contracts, datos_adicionales, id]
  );

  return res.json(rows[0]);
};

export const deleteService = async (req, res) => {
  const id = parseInt(req.params.id);
  const { rowCount } = await pool.query("DELETE FROM servicios_wmc where id = $1",
    [id,]
  );
  if (rowCount === 0) {
    return res.status(404).json({ message: "Servicio no encontrado" });
  }
  return res.sendStatus(204);
};

// #endregion Servicios