const pool = require('../config/db');

// GET /api/mesas - Listar todas las mesas
const getMesas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mesas ORDER BY numero_mesa ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las mesas' });
  }
};

// GET /api/mesas/:id - Obtener mesa por ID
const getMesaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM mesas WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Mesa no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la mesa' });
  }
};

// POST /api/mesas - Crear nueva mesa (Solo admin)
const createMesa = async (req, res) => {
  const { numero_mesa, capacidad, ubicacion } = req.body;

  if (!numero_mesa || !capacidad) {
    return res.status(400).json({ message: 'El número de mesa y la capacidad son obligatorios' });
  }

  try {
    const mesaExist = await pool.query('SELECT * FROM mesas WHERE numero_mesa = $1', [numero_mesa]);
    if (mesaExist.rows.length > 0) {
      return res.status(400).json({ message: 'El número de mesa ya está registrado' });
    }

    const result = await pool.query(
      'INSERT INTO mesas (numero_mesa, capacidad, ubicacion) VALUES ($1, $2, $3) RETURNING *',
      [numero_mesa, capacidad, ubicacion || 'Interior']
    );

    res.status(201).json({
      message: 'Mesa creada exitosamente',
      mesa: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la mesa' });
  }
};

// PUT /api/mesas/:id - Actualizar mesa (Solo admin)
const updateMesa = async (req, res) => {
  const { id } = req.params;
  const { numero_mesa, capacidad, estado, ubicacion } = req.body;

  try {
    const result = await pool.query(
      `UPDATE mesas 
       SET numero_mesa = COALESCE($1, numero_mesa), 
           capacidad = COALESCE($2, capacidad), 
           estado = COALESCE($3, estado), 
           ubicacion = COALESCE($4, ubicacion) 
       WHERE id = $5 
       RETURNING *`,
      [numero_mesa, capacidad, estado, ubicacion, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Mesa no encontrada' });
    }

    res.json({
      message: 'Mesa actualizada correctamente',
      mesa: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la mesa' });
  }
};

// DELETE /api/mesas/:id - Eliminar mesa (Solo admin)
const deleteMesa = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM mesas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Mesa no encontrada' });
    }

    res.json({ message: 'Mesa eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la mesa' });
  }
};

module.exports = {
  getMesas,
  getMesaById,
  createMesa,
  updateMesa,
  deleteMesa
};