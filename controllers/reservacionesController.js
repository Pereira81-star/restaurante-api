const pool = require('../config/db');

// POST /api/reservaciones - Crear nueva reservación (Clientes)
const createReservacion = async (req, res) => {
  const { mesa_id, fecha, hora, personas, notas } = req.body;
  const usuario_id = req.user.id;

  if (!mesa_id || !fecha || !hora || !personas) {
    return res.status(400).json({ message: 'Mesa, fecha, hora y número de personas son obligatorios' });
  }

  try {
    // Validar disponibilidad de la mesa
    const checkAvailability = await pool.query(
      `SELECT * FROM reservaciones 
       WHERE mesa_id = $1 AND fecha = $2 AND hora = $3 AND estado != 'cancelada'`,
      [mesa_id, fecha, hora]
    );

    if (checkAvailability.rows.length > 0) {
      return res.status(400).json({ message: 'La mesa ya está reservada para esa fecha y hora' });
    }

    const result = await pool.query(
      `INSERT INTO reservaciones (usuario_id, mesa_id, fecha, hora, personas, notas, estado)
       VALUES ($1, $2, $3, $4, $5, $6, 'pendiente') RETURNING *`,
      [usuario_id, mesa_id, fecha, hora, personas, notas || '']
    );

    res.status(201).json({
      message: 'Reservación creada exitosamente',
      reservacion: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la reservación' });
  }
};

// GET /api/reservaciones - Consultar reservaciones
const getReservaciones = async (req, res) => {
  try {
    let query = `
      SELECT r.*, u.nombre as usuario_nombre, u.email as usuario_email, m.numero_mesa 
      FROM reservaciones r 
      JOIN usuarios u ON r.usuario_id = u.id 
      JOIN mesas m ON r.mesa_id = m.id
    `;
    const params = [];

    if (req.user.rol === 'cliente') {
      query += ' WHERE r.usuario_id = $1';
      params.push(req.user.id);
    }

    query += ' ORDER BY r.fecha DESC, r.hora DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las reservaciones' });
  }
};

// PATCH /api/reservaciones/:id/estado - Actualizar estado
const updateEstadoReservacion = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ message: 'El nuevo estado es obligatorio' });
  }

  try {
    if (req.user.rol === 'cliente') {
      const checkOwner = await pool.query('SELECT usuario_id FROM reservaciones WHERE id = $1', [id]);
      if (checkOwner.rows.length === 0) {
        return res.status(404).json({ message: 'Reservación no encontrada' });
      }
      if (checkOwner.rows[0].usuario_id !== req.user.id) {
        return res.status(403).json({ message: 'No tienes permiso para modificar esta reservación' });
      }
    }

    const result = await pool.query(
      'UPDATE reservaciones SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reservación no encontrada' });
    }

    res.json({
      message: 'Estado de la reservación actualizado correctamente',
      reservacion: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la reservación' });
  }
};

module.exports = {
  createReservacion,
  getReservaciones,
  updateEstadoReservacion
};