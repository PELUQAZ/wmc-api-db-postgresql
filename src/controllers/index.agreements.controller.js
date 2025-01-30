import { pool } from "../db.js";

//Obtener acuerdos
export const getAgreements = async (req, res) => {
  //const response = await pool.query("SELECT * FROM tx_acuerdos ORDER BY id ASC");
  const response = await pool.query("SELECT a.id, a.servicio_id, a.horas, a.monto, a.fecha_inicio, a.estado_arbitraje, a.fecha_fin, a.address_sc," + 
    "a.fecha_acuerdo, a.tipo_token, a.acuerdo_id_sc, a.pagador_de_acuerdo, a.proveedor_de_acuerdo, a.hash_tx, a.id_pagador," +
    "upa.wallet AS wallet_pagador, a.id_proveedor, upr.wallet AS wallet_proveedor, a.id_arbitro, ua.wallet AS wallet_arbitro " +
    "FROM tx_acuerdos a " +
    "LEFT JOIN usuarios_wmc upa ON a.id_pagador = upa.id " +
    "LEFT JOIN usuarios_wmc upr ON a.id_proveedor = upr.id " +
    "LEFT JOIN usuarios_wmc ua ON a.id_arbitro = ua.id"
  );
  res.status(200).json(response.rows);
};

//Obtener acuerdos por wallet
export const getAgreementsByWallet = async (req, res) => {
  const wallet = req.params.wallet;
  const response = await pool.query("SELECT a.id, a.servicio_id, a.horas, a.monto, a.fecha_inicio, a.estado_arbitraje, a.fecha_fin, a.address_sc," + 
    "a.fecha_acuerdo, a.tipo_token, a.acuerdo_id_sc, a.pagador_de_acuerdo, a.proveedor_de_acuerdo, a.hash_tx, a.id_pagador," +
    "upa.wallet AS wallet_pagador, a.id_proveedor, upr.wallet AS wallet_proveedor, a.id_arbitro, ua.wallet AS wallet_arbitro " +
    "FROM tx_acuerdos a " +
    "LEFT JOIN usuarios_wmc upa ON a.id_pagador = upa.id " +
    "LEFT JOIN usuarios_wmc upr ON a.id_proveedor = upr.id" +
    "LEFT JOIN usuarios_wmc ua ON a.id_arbitro = ua.id " + 
    "WHERE upa.wallet ILIKE $1 OR upr.wallet ILIKE $1 OR ua.wallet ILIKE $1", [wallet]);
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
    const { servicio_id, horas, monto, fecha_inicio, fecha_fin, address_sc, 
      tipo_token, acuerdo_id_sc, hash_tx, id_pagador, id_arbitro, id_proveedor } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO tx_acuerdos (servicio_id, horas, monto, fecha_inicio, fecha_fin, address_sc, " + 
      "tipo_token, acuerdo_id_sc, hash_tx, id_pagador, id_arbitro, id_proveedor) " +
      "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
      [servicio_id, horas, monto, fecha_inicio, fecha_fin, address_sc, 
        tipo_token, acuerdo_id_sc, hash_tx, id_pagador, id_arbitro, id_proveedor]
    );
    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};