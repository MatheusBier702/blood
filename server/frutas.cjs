
const { criarTradutor } = require('./traducao.cjs');

function criarProxyFrutas(fetchApi = fetch) {
  const traduzir = criarTradutor(fetchApi);
  return async function proxyFrutas(req, res, next) {
    const url = new URL(req.url, 'http://localhost');

    if (!url.pathname.startsWith('/api/frutas/')) {
      return next();
    }

    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    if (req.method !== 'GET') {
      res.writeHead(405, { Allow: 'GET, OPTIONS' });
      return res.end();
    }

    try {
      let nome = decodeURIComponent(url.pathname.slice('/api/frutas/'.length)).trim();
      if (!nome || nome.length > 80 || /[\/?#]/.test(nome)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Digite apenas o nome de uma fruta.' }));
      }
      if (url.searchParams.get('traduzir') === '1') nome = await traduzir(nome);
      const resposta = await fetchApi(
        `https://www.fruityvice.com/api/fruit/${encodeURIComponent(nome)}`,
        {
          signal: AbortSignal.timeout(10000),
        }
      );

      const corpo = await resposta.text();

      res.writeHead(resposta.status, {
        'Content-Type':
          resposta.headers.get('content-type') || 'application/json',
      });

      res.end(corpo);
    } catch (erro) {
      res.writeHead(erro.status || 502, {
        'Content-Type': 'application/json',
      });

      res.end(JSON.stringify({
        error: erro.status ? erro.message : 'Falha ao consultar a fruta. Tente novamente.',
      }));
    }
  };
}

module.exports = { criarProxyFrutas };
