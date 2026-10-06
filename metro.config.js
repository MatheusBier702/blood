const { getDefaultConfig } = require('expo/metro-config');
const { criarProxyFrutas } = require('./server/frutas.cjs');

const config = getDefaultConfig(__dirname);
const anterior = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, server) => {
  const proximo = anterior ? anterior(middleware, server) : middleware;
  const proxy = criarProxyFrutas();
  return (req, res, next) => proxy(req, res, () => proximo(req, res, next));
};

module.exports = config;
