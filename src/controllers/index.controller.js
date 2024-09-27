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
    const { name, email } = req.body;

    const { rows } = await pool.query(
      "INSERT INTO usuarios_wmc (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  const { rows } = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id]
  );

  return res.json(rows[0]);
};

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { rowCount } = await pool.query("DELETE FROM usuarios_wmc where id = $1", [
    id,
  ]);

  if (rowCount === 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  return res.sendStatus(204);
};
