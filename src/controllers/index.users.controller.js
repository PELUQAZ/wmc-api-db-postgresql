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

export const getUserByWallet = async (req, res) => {
  const wallet = req.params.wallet;
  const response = await pool.query("SELECT * FROM usuarios_wmc WHERE wallet ILIKE $1", [wallet]);
  res.json(response.rows);
};

export const getUsersIdByWallets = async (req, res) => {
  try {
    const wallets = req.params.wallets.split(",").map(w => w.toLowerCase()); // Convertir a minúsculas para asegurar coincidencias
    // Mapa de roles basado en el orden en que llegan las wallets
    const walletRoles = {
      [wallets[0]]: "pagador",
      [wallets[1]]: "proveedor",
      [wallets[2]]: "árbitro"
    };

    const response = await pool.query("SELECT id, LOWER(wallet) AS wallet FROM usuarios_wmc WHERE LOWER(wallet) = ANY($1)", [wallets]);
    // Mapear los resultados para incluir el rol de cada wallet
    const result = response.rows.map(row => ({
      id: row.id,
      wallet: row.wallet,
      rol: walletRoles[row.wallet] || "desconocido"  // Asignar el rol basado en la wallet
    }));

    res.json(result);
  } catch (error) {
    console.error("Error al obtener IDs de usuarios por wallets:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
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
      "WHERE wallet ILIKE $9 RETURNING *",
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