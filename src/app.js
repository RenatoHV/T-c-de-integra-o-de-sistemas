const express = require('express');
const cors = require('cors');

const healthRouter = require('./routes/health');
const cidadesRouter = require('./routes/cidades');
const climaRouter = require('./routes/clima');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/v1/health', healthRouter);
app.use('/api/v1/cidades', cidadesRouter);
app.use('/api/v1/clima', climaRouter);

app.use((req, res) => {
  res.status(404).json({
    erro: true,
    codigo: "ROTA_NAO_ENCONTRADA",
    mensagem: "Rota não encontrada"
  });
});

module.exports = app;
