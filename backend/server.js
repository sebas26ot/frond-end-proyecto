const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_ENV = process.env.APP_ENV || 'development';
const APP_VERSION = process.env.APP_VERSION || '3.0.0';

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({
    mensaje: 'Conexion exitosa entre frontend y backend',
    entrega: 'Entrega 3 - Integracion Continua'
  });
});

app.get('/api/mensaje', (req, res) => {
  res.json({
    mensaje: 'Conexion exitosa entre frontend y backend',
    entrega: 'Entrega 3 - Integracion Continua'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'backend',
    environment: APP_ENV,
    version: APP_VERSION
  });
});

app.get('/api/version', (req, res) => {
  res.json({
    proyecto: 'TechSolutions S.A.S.',
    version: APP_VERSION,
    entrega: 'Entrega 3',
    integracion: 'Docker, Jenkins, Travis CI y Codeship'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutandose en el puerto ${PORT}`);
});