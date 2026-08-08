const router = require('express').Router();
const { 
  getMesas, 
  getMesaById, 
  createMesa, 
  updateMesa, 
  deleteMesa 
} = require('../controllers/mesasController');

const verifyToken = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

/**
 * @openapi
 * /api/mesas:
 *   get:
 *     summary: Obtener lista de mesas
 *     tags: [Mesas]
 *     responses:
 *       200:
 *         description: Lista de mesas
 */
router.get('/', getMesas);

/**
 * @openapi
 * /api/mesas/{id}:
 *   get:
 *     summary: Obtener mesa por ID
 *     tags: [Mesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos de la mesa
 */
router.get('/:id', getMesaById);

/**
 * @openapi
 * /api/mesas:
 *   post:
 *     summary: Crear una nueva mesa (Admin)
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero_mesa: { type: integer }
 *               capacidad: { type: integer }
 *               ubicacion: { type: string }
 *     responses:
 *       201:
 *         description: Mesa creada
 */
router.post('/', verifyToken, requireRole('admin'), createMesa);

/**
 * @openapi
 * /api/mesas/{id}:
 *   put:
 *     summary: Actualizar mesa (Admin)
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mesa actualizada
 */
router.put('/:id', verifyToken, requireRole('admin'), updateMesa);

/**
 * @openapi
 * /api/mesas/{id}:
 *   delete:
 *     summary: Eliminar mesa (Admin)
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mesa eliminada
 */
router.delete('/:id', verifyToken, requireRole('admin'), deleteMesa);

module.exports = router;