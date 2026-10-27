const express = require('express');
const cors = require('cors');
const db = require('./db');
const { criarRotasUsuarios } = require('./usuarios.cjs');
const { criarProxyFrutas } = require('./frutas.cjs');

function criarApp(banco = db) {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '16kb' }));
  app.use(criarProxyFrutas());
  app.use('/api', criarRotasUsuarios(banco));
  app.use((erro, req, res, next) => {
    if (erro.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido.' });
    if (erro.type === 'entity.too.large') return res.status(413).json({ error: 'Requisição muito grande.' });
    console.error('Erro na API:', erro.code);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  });
  return app;
}

function iniciarServidor() {
  const porta = Number(process.env.PORT || 3000);
  return criarApp().listen(porta, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${porta}`);
  });
}

if (require.main === module) iniciarServidor();
module.exports = { criarApp, iniciarServidor };
