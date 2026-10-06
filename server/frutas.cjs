// Encaminha a consulta pelo servidor para evitar CORS no navegador.
function criarProxyFrutas(fetchApi = fetch) {
  return async function proxyFrutas(req, res, next) {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith('/api/frutas/')) return next();
    const nome = url.pathname.slice('/api/frutas/'.length);
    try {
      const resposta = await fetchApi(`https://www.fruityvice.com/api/fruit/${nome}`, {
        signal: AbortSignal.timeout(10000),
      });
      const corpo = await resposta.text();
      res.writeHead(resposta.status, { 'Content-Type': resposta.headers.get('content-type') || 'application/json' });
      res.end(corpo);
    } catch {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Falha ao consultar Fruityvice' }));
    }
  };
}

module.exports = { criarProxyFrutas };
