const { getDefaultConfig } = require('expo/metro-config');
const { criarProxyFrutas } = require('./server/frutas.cjs');
const { criarProxyUbs } = require('./server/ubs.cjs');

const config = getDefaultConfig(__dirname);
const anterior = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, server) => {
  const proximo = anterior ? anterior(middleware, server) : middleware;
  const proxyFrutas = criarProxyFrutas();
  const proxyUbs = criarProxyUbs();
  return (req, res, next) =>
    proxyFrutas(req, res, () => proxyUbs(req, res, () => proximo(req, res, next)));
};

module.exports = config;
