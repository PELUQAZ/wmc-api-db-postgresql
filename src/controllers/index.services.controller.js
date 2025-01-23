import { pool } from "../db.js";

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