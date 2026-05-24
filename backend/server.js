const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/api/mensaje', (req, res) => {
    res.json({
        mensaje: 'Conexion exitosa entre frontend y backend'
    });
});

app.listen(3000, () => {
    console.log('Servidor backend ejecutandose');
});