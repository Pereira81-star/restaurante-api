const router = require('express').Router();
const { 
  createReservacion, 
  getReservaciones, 
  updateEstadoReservacion 
} = require('../controllers/reservacionesController');

const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken);

/**
 * @openapi
 * /api/reservaciones:
 *   post:
 *     summary: Crear nueva reservación
 *     tags: [Reservaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mesa_id: { type: integer }
 *               fecha: { type: string, format: date }
 *               hora: { type: string }
 *               personas: { type: integer }
 *               notas: { type: string }
 *     responses:
 *       201:
 *         description: Reservación creada
 */
router.post('/', createReservacion);

/**
 * @openapi
 * /api/reservaciones:
 *   get:
 *     summary: Obtener lista de reservaciones
 *     tags: [Reservaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservaciones
 */
router.get('/', getReservaciones);

/**
 * @openapi
 * /api/reservaciones/{id}/estado:
 *   patch:
 *     summary: Actualizar estado de reservación
 *     tags: [Reservaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado: { type: string, enum: [confirmada, cancelada] }
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch('/:id/estado', updateEstadoReservacion);

module.exports = router;