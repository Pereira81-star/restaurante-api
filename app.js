const express = require('express');
const cors = require('cors');

const setupSwagger = require('./swagger/swagger');
const authRoutes = require('./routes/authRoutes');
const mesasRoutes = require('./routes/mesasRoutes');
const reservacionesRoutes = require('./routes/reservacionesRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Documentación interactiva de la API
setupSwagger(app);

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/reservaciones', reservacionesRoutes);

// Ruta de prueba raíz
app.get('/', (req, res) => {
  res.json({ message: 'API del Restaurante funcionando correctamente' });
});

module.exports = app;