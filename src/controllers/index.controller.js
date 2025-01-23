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
  const wallet = req.params.wallet;
  const response = await pool.query("SELECT * FROM usuarios_wmc WHERE wallet = $1", [wallet]);
  res.json(response.rows);
};

//Crear usuario
export const createUser = async (req, res) => {
  try {
    const { nombre_completo, email, wallet, pais, reputacion, rol_usuario, estado, nro_movil, bio } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO usuarios_wmc (nombre_completo, email, wallet, pais, reputacion, rol_usuario, estado, nro_movil, bio)" +
      " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [nombre_completo, email, wallet, pais, reputacion, rol_usuario, estado, nro_movil, bio]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre_completo, email, wallet, pais, reputacion, rol_usuario, estado, nro_movil, bio } = req.body;

  const { rows } = await pool.query(
    "UPDATE usuarios_wmc SET nombre_completo = $1, email = $2, wallet = $3, pais = $4, reputacion = $5, " +
    "rol_usuario = $6, estado = $7, nro_movil = $8, bio = $9 " +
    "WHERE id = $10 RETURNING *",
    [nombre_completo, email, wallet, pais, reputacion, rol_usuario, estado, nro_movil, bio, id]
  );

  return res.json(rows[0]);
};

export const updateUserByWallet = async (req, res) => {
  const wallet = req.params.wallet;
  const { nombre_completo, email, pais, reputacion, rol_usuario, estado, nro_movil, bio } = req.body;

  try {
    const { rows } = await pool.query(
      "UPDATE usuarios_wmc SET nombre_completo = $1, email = $2, pais = $3, reputacion = $4, " +
      "rol_usuario = $5, estado = $6, nro_movil = $7, bio = $8 " +
      "WHERE wallet = $9 RETURNING *",
      [nombre_completo, email, pais, reputacion, rol_usuario, estado, nro_movil, bio, wallet]
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

export const getServicesByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const response = await pool.query("SELECT " + 
      "s.id AS servicio_id, s.colaborador_id, u.wallet AS wallet_colaborador, s.titulo_servicio," +
      "s.descripcion, s.categoria, s.valor_hora, s.fecha_registro, s.estado, s.modificado " +    
      "FROM servicios_wmc s INNER JOIN usuarios_wmc u ON s.colaborador_id = u.id WHERE colaborador_id = $1", [userId]);
    // Verifica si se encontraron servicios
    if (response.rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron servicios para usuario id " + userId });
    }
    res.json(response.rows);
  } catch (error) {
    console.error("Error al obtener servicios por usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

//Crear servicio
export const createService = async (req, res) => {
  try {
    const { colaborador_id, titulo_servicio, descripcion, categoria, valor_hora, estado } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO servicios_wmc (colaborador_id, titulo_servicio, descripcion, categoria, valor_hora, estado)" +
      " VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [colaborador_id, titulo_servicio, descripcion, categoria, valor_hora, estado]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { colaborador_id, titulo_servicio, descripcion, categoria, valor_hora, estado } = req.body;

    const { rows } = await pool.query(
      "UPDATE servicios_wmc SET colaborador_id = $1, titulo_servicio = $2, descripcion = $3, " +
      "categoria = $4, valor_hora = $5, estado = $6 " +
      "WHERE id = $7 RETURNING *",
      [colaborador_id, titulo_servicio, descripcion, categoria, valor_hora, estado, id]
    );

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
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

// #region Acuerdos

//Obtener acuerdos
export const getAgreements = async (req, res) => {
  //const response = await pool.query("SELECT * FROM tx_acuerdos ORDER BY id ASC");
  const response = await pool.query("SELECT a.id AS id_acuerdo, a.id_servicio, a.horas, a.monto, a.fecha_inicio, a.estado_arbitraje, a.fecha_fin, a.hash_sc," + 
    "a.fecha_acuerdo, a.tipo_token, a.acuerdo_id_sc, a.pagador_de_acuerdo, a.proveedor_de_acuerdo, a.hash_tx, a.id_pagador," +
    "upa.wallet AS wallet_pagador, a.id_proveedor, upr.wallet AS wallet_proveedor, a.id_arbitro, ua.wallet AS wallet_arbitro " +
    "FROM tx_acuerdos a " +
    "LEFT JOIN usuarios_wmc upa ON a.id_pagador = upa.id " +
    "LEFT JOIN usuarios_wmc upr ON a.id_proveedor = upr.id" +
    "LEFT JOIN usuarios_wmc ua ON a.id_arbitro = ua.id"
  );
  res.status(200).json(response.rows);
};

//Obtener acuerdos por wallet
export const getAgreementsByWallet = async (req, res) => {
  const wallet = req.params.wallet;
  const response = await pool.query("SELECT a.id AS id_acuerdo, a.id_servicio, a.horas, a.monto, a.fecha_inicio, a.estado_arbitraje, a.fecha_fin, a.hash_sc," + 
    "a.fecha_acuerdo, a.tipo_token, a.acuerdo_id_sc, a.pagador_de_acuerdo, a.proveedor_de_acuerdo, a.hash_tx, a.id_pagador," +
    "upa.wallet AS wallet_pagador, a.id_proveedor, upr.wallet AS wallet_proveedor, a.id_arbitro, ua.wallet AS wallet_arbitro " +
    "FROM tx_acuerdos a " +
    "LEFT JOIN usuarios_wmc upa ON a.id_pagador = upa.id " +
    "LEFT JOIN usuarios_wmc upr ON a.id_proveedor = upr.id" +
    "LEFT JOIN usuarios_wmc ua ON a.id_arbitro = ua.id " + 
    "WHERE upa.wallet = $1 OR upr.wallet = $1 OR ua.wallet = $1", [wallet]);
  res.status(200).json(response.rows);
};

////Consultar acuerdos a pagar
//export const getAgreementsToPay = async (req, res) => {
//  const response = await pool.query("SELECT id FROM tx_acuerdos WHERE fecha_fin = CURRENT_DATE AND estado IN ('Contratado', 'EnCurso') ORDER BY id ASC");
//  res.status(200).json(response.rows);
//};

//Crear acuerdo
export const createAgreement = async (req, res) => {
  try {
    const { servicio_id, horas, monto, fecha_inicio, estado_arbitraje, fecha_fin, hash_sc, fecha_acuerdo, tipo_token, 
      acuerdo_id_sc, pagador_de_acuerdo, proveedor_de_acuerdo, hash_tx, id_pagador, id_arbitro, id_proveedor } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO tx_acuerdos (servicio_id, horas, monto, fecha_inicio, estado_arbitraje, fecha_fin, hash_sc, fecha_acuerdo, tipo_token, " +
      "acuerdo_id_sc, pagador_de_acuerdo, proveedor_de_acuerdo, hash_tx, id_pagador, id_arbitro, id_proveedor) " +
      "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 15, $16) RETURNING *",
      [servicio_id, horas, monto, fecha_inicio, estado_arbitraje, fecha_fin, hash_sc, fecha_acuerdo, tipo_token, 
        acuerdo_id_sc, pagador_de_acuerdo, proveedor_de_acuerdo, hash_tx, id_pagador, id_arbitro, id_proveedor]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// #endregion Acuerdos