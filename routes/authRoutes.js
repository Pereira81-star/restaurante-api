const router = require('express').Router();
const { register, login, getPerfil } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo cliente
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */
router.post('/register', register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 */
router.post('/login', login);

/**
 * @openapi
 * /api/auth/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil
 */
router.get('/perfil', verifyToken, getPerfil);

module.exports = router;