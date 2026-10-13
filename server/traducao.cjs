const path = require('node:path');

try {
  process.loadEnvFile(path.join(__dirname, '..', '.env.local'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

function criarTradutor(fetchApi = fetch, chave = process.env.DEEPL_API_KEY) {
  const cache = new Map();
  return async (texto) => {
    const entrada = texto.trim();
    const cacheKey = entrada.toLowerCase();
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    if (!chave) {
      const erro = new Error('Configure DEEPL_API_KEY no arquivo .env.local.');
      erro.status = 503;
      throw erro;
    }
    const host = chave.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
    const resposta = await fetchApi(`${host}/v2/translate`, {
      method: 'POST',
      headers: { Authorization: `DeepL-Auth-Key ${chave}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: [entrada], source_lang: 'PT', target_lang: 'EN', context: 'Nome de uma fruta para consulta nutricional.' }),
      signal: AbortSignal.timeout(10000),
    });
    if (!resposta.ok) {
      const erro = new Error(resposta.status === 456
        ? 'Limite de tradução da DeepL atingido.'
        : resposta.status === 403 ? 'A chave da DeepL não foi aceita.' : 'Não foi possível traduzir a fruta. Tente novamente.');
      erro.status = resposta.status === 429 ? 429 : 502;
      throw erro;
    }
    const dados = await resposta.json();
    const traducao = dados.translations?.[0]?.text?.trim().toLowerCase();
    if (!traducao) throw new Error('Resposta de tradução inválida.');
    if (cache.size >= 500) cache.delete(cache.keys().next().value);
    cache.set(cacheKey, traducao);
    return traducao;
  };
}

module.exports = { criarTradutor };
