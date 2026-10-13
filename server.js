
const express = require('express');
const { criarProxyFrutas } = require('./server/frutas.cjs');

const app = express();

// Registra o proxy no servidor
app.use(criarProxyFrutas());

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
