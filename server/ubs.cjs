// Proxy das UBSs próximas e das rotas até elas.
// - Unidades: API de dados abertos do CNES (Ministério da Saúde), tipos 1 (posto
//   de saúde) e 2 (centro de saúde/unidade básica) que atendem pelo SUS.
// - Município do usuário: geocodificação reversa do Nominatim (código IBGE).
// - Distância real e rota: Valhalla (https://valhalla.github.io/valhalla/).
// Funciona como middleware do Metro (desenvolvimento) e do Express (server/index.js).

const fs = require('node:fs');
const path = require('node:path');

const CNES_URL = 'https://apidadosabertos.saude.gov.br/cnes/estabelecimentos';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const VALHALLA_URL = (process.env.VALHALLA_URL || 'https://valhalla1.openstreetmap.de').replace(/\/$/, '');
const AGENTE = 'BloodApp/1.0 (aplicativo educacional de saude)';

const TIPOS_UBS = [1, 2];
const POR_PAGINA = 20; // a API do CNES ignora limites maiores
const PAGINAS_EM_PARALELO = 8;
const MAX_PAGINAS = 200;
const MAX_RESULTADOS = 15;
const RAIO_MAXIMO_KM = 30;
const UM_DIA = 24 * 60 * 60 * 1000;
const MODOS = { pe: 'pedestrian', carro: 'auto' };
const PASTA_CACHE = path.join(__dirname, '.cache');
// O CNES coloca no centro da cidade as unidades que não têm coordenada conhecida.
// Unidades nesse raio têm o endereço conferido no OpenStreetMap antes de aparecer.
const RAIO_SUSPEITO_KM = 3;
// Quando não acha o endereço, o Nominatim às vezes devolve a própria cidade.
const RESULTADOS_GENERICOS = new Set(['country', 'region', 'state', 'state_district', 'county', 'municipality', 'city', 'town', 'village']);
const DIFERENCA_ACEITA_KM = 0.8;
const INTERVALO_NOMINATIM_MS = 1100; // política de uso: no máximo 1 requisição por segundo
// Prazos para o app nunca ficar esperando até estourar o tempo dele.
const PRAZO_CNES_MS = 40000;
const PRAZO_CONFERENCIA_MS = 8000;

function distanciaKm(a, b) {
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

// Valhalla codifica as linhas com precisão de 6 casas decimais.
function decodificarPolyline(texto, precisao = 6) {
  const fator = 10 ** precisao;
  const pontos = [];
  let i = 0, lat = 0, lon = 0;
  while (i < texto.length) {
    for (const eixo of [0, 1]) {
      let resultado = 0, deslocamento = 0, byte;
      do {
        byte = texto.charCodeAt(i++) - 63;
        resultado |= (byte & 0x1f) << deslocamento;
        deslocamento += 5;
      } while (byte >= 0x20);
      const delta = resultado & 1 ? ~(resultado >> 1) : resultado >> 1;
      if (eixo === 0) lat += delta; else lon += delta;
    }
    pontos.push([lat / fator, lon / fator]);
  }
  return pontos;
}

function lerCoordenada(texto) {
  const partes = String(texto || '').split(',').map(Number);
  if (partes.length !== 2) return null;
  const [lat, lon] = partes;
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
}

function erroHttp(status, mensagem, extras = {}) {
  const erro = new Error(mensagem);
  erro.status = status;
  erro.extras = extras;
  return erro;
}

const PENDENTE = Symbol('pendente');
const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms).unref?.());

// Rejeita com o erro de `fazerErro` se a promessa não terminar no prazo (ela segue rodando).
const comPrazo = (promessa, ms, fazerErro) =>
  new Promise((ok, falha) => {
    const timer = setTimeout(() => falha(fazerErro()), ms);
    timer.unref?.();
    promessa.then(
      (valor) => { clearTimeout(timer); ok(valor); },
      (erro) => { clearTimeout(timer); falha(erro); }
    );
  });

function titulo(texto) {
  return String(texto || '')
    .toLowerCase()
    .replace(/(^|[\s/(-])([a-zà-ú])/g, (_, antes, letra) => antes + letra.toUpperCase())
    .replace(/\b(Ubs|Usf|Ama|Esf|Sus|Ii|Iii|Iv)\b/g, (s) => s.toUpperCase())
    .replace(/\b(De|Da|Do|Das|Dos|E)\b/g, (s) => s.toLowerCase());
}

function formatarUnidade(e) {
  const rua = [e.endereco_estabelecimento, e.numero_estabelecimento].filter(Boolean).join(', ');
  const telefone = String(e.numero_telefone_estabelecimento || '').trim();
  return {
    id: String(e.codigo_cnes),
    nome: titulo(e.nome_fantasia || e.nome_razao_social),
    endereco: titulo([rua, e.bairro_estabelecimento].filter(Boolean).join(' - ')),
    rua: titulo(rua),
    cep: String(e.codigo_cep_estabelecimento || '').replace(/\D/g, '') || null,
    telefone: telefone || null,
    turno: e.descricao_turno_atendimento ? titulo(e.descricao_turno_atendimento) : null,
    lat: Number(e.latitude_estabelecimento_decimo_grau),
    lon: Number(e.longitude_estabelecimento_decimo_grau),
  };
}

function lerCacheDisco(municipio) {
  try {
    const salvo = JSON.parse(fs.readFileSync(path.join(PASTA_CACHE, `ubs-${municipio}.json`), 'utf8'));
    return salvo.expira > Date.now() && Array.isArray(salvo.unidades) ? salvo : null;
  } catch {
    return null;
  }
}

function gravarCacheDisco(municipio, expira, unidades) {
  try {
    fs.mkdirSync(PASTA_CACHE, { recursive: true });
    fs.writeFileSync(path.join(PASTA_CACHE, `ubs-${municipio}.json`), JSON.stringify({ expira, unidades }));
  } catch {
    // sem cache em disco, continua só com a memória
  }
}

const ARQUIVO_CONFERIDAS = path.join(PASTA_CACHE, 'ubs-conferidas.json');

function lerConferidasDisco() {
  try {
    const salvo = JSON.parse(fs.readFileSync(ARQUIVO_CONFERIDAS, 'utf8'));
    return new Map(Object.entries(salvo).map(([id, posicao]) => [id, Promise.resolve(posicao)]));
  } catch {
    return new Map();
  }
}

function criarServicoUbs(fetchApi = fetch, { usarDisco = true } = {}) {
  const cacheMunicipios = new Map(); // "lat,lon" arredondado -> município
  const cacheUnidades = new Map(); // código do município -> { expira, promessa }
  // id da unidade -> Promise<{lat, lon} | null>, também guardado em disco
  const cacheConferidas = usarDisco ? lerConferidasDisco() : new Map();
  const conferidasResolvidas = {};
  let gravacaoAgendada = null;
  let filaNominatim = Promise.resolve();

  function guardarConferida(id, posicao) {
    if (!usarDisco) return;
    conferidasResolvidas[id] = posicao;
    clearTimeout(gravacaoAgendada);
    gravacaoAgendada = setTimeout(async () => {
      try {
        const anteriores = {};
        for (const [chave, promessa] of cacheConferidas) anteriores[chave] = await promessa;
        fs.mkdirSync(PASTA_CACHE, { recursive: true });
        fs.writeFileSync(ARQUIVO_CONFERIDAS, JSON.stringify({ ...anteriores, ...conferidasResolvidas }));
      } catch {
        // sem cache em disco, continua só com a memória
      }
    }, 500);
    gravacaoAgendada.unref?.();
  }

  // Serializa as chamadas ao Nominatim respeitando o limite de 1 por segundo.
  function naFilaDoNominatim(tarefa) {
    const resultado = filaNominatim.then(tarefa);
    filaNominatim = resultado
      .catch(() => {})
      .then(() => new Promise((ok) => setTimeout(ok, INTERVALO_NOMINATIM_MS)));
    return resultado;
  }

  async function buscarJson(url, opcoes = {}, tempo = 20000) {
    const resposta = await fetchApi(url, {
      ...opcoes,
      headers: { Accept: 'application/json', 'User-Agent': AGENTE, ...(opcoes.headers || {}) },
      signal: AbortSignal.timeout(tempo),
    });
    if (!resposta.ok) {
      const erro = erroHttp(502, `Serviço externo respondeu ${resposta.status}.`);
      erro.corpo = await resposta.json().catch(() => null);
      throw erro;
    }
    return resposta.json();
  }

  async function municipioDe({ lat, lon }) {
    const chave = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    if (cacheMunicipios.has(chave)) return cacheMunicipios.get(chave);
    const url = `${NOMINATIM_URL}/reverse?format=jsonv2&zoom=10&extratags=1&addressdetails=1&accept-language=pt-BR&lat=${lat}&lon=${lon}`;
    const dados = await naFilaDoNominatim(() => buscarJson(url, {}, 15000));
    const ibge = dados?.extratags?.['IBGE:GEOCODIGO'];
    if (dados?.address?.country_code !== 'br' || !/^\d{7}$/.test(ibge || '')) {
      throw erroHttp(404, 'Só encontramos UBSs para localizações no Brasil.');
    }
    const municipio = {
      codigo: ibge.slice(0, 6), // o CNES usa o código IBGE sem o dígito verificador
      nome: dados.address.city || dados.address.town || dados.address.municipality || dados.name || '',
      uf: dados.address.state || '',
      centro: { lat: Number(dados.lat), lon: Number(dados.lon) },
    };
    cacheMunicipios.set(chave, municipio);
    return municipio;
  }

  async function paginaCnes(municipio, tipo, pagina) {
    const url = `${CNES_URL}?codigo_tipo_unidade=${tipo}&codigo_municipio=${municipio}&limit=${POR_PAGINA}&offset=${pagina}`;
    const dados = await buscarJson(url, {}, 30000);
    return Array.isArray(dados?.estabelecimentos) ? dados.estabelecimentos : [];
  }

  // A API pagina por índice de página (offset=0,1,2...), 20 itens por vez e ~3 s por
  // chamada; buscamos várias páginas em paralelo e guardamos o município por um dia.
  async function todasDoTipo(municipio, tipo) {
    const todas = [];
    for (let inicio = 0; inicio < MAX_PAGINAS; inicio += PAGINAS_EM_PARALELO) {
      const paginas = await Promise.all(
        Array.from({ length: PAGINAS_EM_PARALELO }, (_, i) => paginaCnes(municipio, tipo, inicio + i))
      );
      for (const pagina of paginas) todas.push(...pagina);
      if (paginas.some((pagina) => pagina.length < POR_PAGINA)) break;
    }
    return todas;
  }

  function unidadesDoMunicipio(municipio) {
    const salvo = cacheUnidades.get(municipio);
    if (salvo && salvo.expira > Date.now()) return salvo.promessa;

    const disco = usarDisco ? lerCacheDisco(municipio) : null;
    if (disco) {
      const promessa = Promise.resolve(disco.unidades);
      cacheUnidades.set(municipio, { expira: disco.expira, promessa });
      return promessa;
    }

    const expira = Date.now() + UM_DIA;
    const promessa = Promise.all(TIPOS_UBS.map((tipo) => todasDoTipo(municipio, tipo))).then((listas) => {
      const vistos = new Set();
      const unidades = listas
        .flat()
        .filter((e) => e.estabelecimento_faz_atendimento_ambulatorial_sus === 'SIM')
        .filter((e) => !e.codigo_motivo_desabilitacao_estabelecimento)
        .map(formatarUnidade)
        .filter((u) => Number.isFinite(u.lat) && Number.isFinite(u.lon) && u.lat !== 0 && u.lon !== 0)
        .filter((u) => !vistos.has(u.id) && vistos.add(u.id));
      if (usarDisco) gravarCacheDisco(municipio, expira, unidades);
      return unidades;
    });
    cacheUnidades.set(municipio, { expira, promessa });
    promessa.catch(() => cacheUnidades.delete(municipio));
    return promessa;
  }

  async function geocodificar(parametros) {
    const url = `${NOMINATIM_URL}/search?format=jsonv2&limit=1&countrycodes=br&${new URLSearchParams(parametros)}`;
    const [achado] = await naFilaDoNominatim(() => buscarJson(url, {}, 15000));
    if (!achado || RESULTADOS_GENERICOS.has(achado.addresstype)) return null;
    return { lat: Number(achado.lat), lon: Number(achado.lon) };
  }

  // Confere no OpenStreetMap o endereço de uma unidade que está perto do centro.
  // Retorna a posição correta, ou null quando não dá para confirmar o local.
  function conferirUnidade(unidade, municipio) {
    if (cacheConferidas.has(unidade.id)) return cacheConferidas.get(unidade.id);
    const promessa = (async () => {
      const cidade = { city: municipio.nome, state: municipio.uf };
      let achado = unidade.rua ? await geocodificar({ street: unidade.rua, ...cidade }) : null;
      if (!achado && unidade.cep) {
        achado = await geocodificar({ postalcode: unidade.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2'), ...cidade });
      }
      const posicao = !achado
        ? null
        : distanciaKm(achado, unidade) <= DIFERENCA_ACEITA_KM
          ? { lat: unidade.lat, lon: unidade.lon }
          : achado;
      guardarConferida(unidade.id, posicao);
      return posicao;
    })().catch(() => {
      // falha de rede: não guarda, tenta de novo na próxima busca
      cacheConferidas.delete(unidade.id);
      return null;
    });
    cacheConferidas.set(unidade.id, promessa);
    return promessa;
  }

  // Confere as suspeitas dentro de um prazo. O que não terminar a tempo fica de fora
  // desta resposta, mas a conferência continua em segundo plano (e fica em cache),
  // então aparece numa próxima busca. Devolve quantas ficaram pendentes.
  async function corrigirSuspeitas(unidades, municipio) {
    const limite = Date.now() + PRAZO_CONFERENCIA_MS;
    let pendentes = 0;
    const conferidas = await Promise.all(
      unidades.map(async (u) => {
        if (!Number.isFinite(municipio.centro.lat) || distanciaKm(u, municipio.centro) > RAIO_SUSPEITO_KM) return u;
        const resultado = await Promise.race([
          conferirUnidade(u, municipio),
          esperar(Math.max(0, limite - Date.now())).then(() => PENDENTE),
        ]);
        if (resultado === PENDENTE) {
          pendentes += 1;
          return null;
        }
        return resultado ? { ...u, ...resultado } : null;
      })
    );
    return { unidades: conferidas.filter(Boolean), pendentes };
  }

  // Ordena pela distância real a pé (matriz do Valhalla); sem resposta, usa a linha reta.
  async function ordenarPorRota(origem, unidades, modo) {
    try {
      const corpo = {
        sources: [{ lat: origem.lat, lon: origem.lon }],
        targets: unidades.map((u) => ({ lat: u.lat, lon: u.lon })),
        costing: modo,
        units: 'kilometers',
      };
      const dados = await buscarJson(`${VALHALLA_URL}/sources_to_targets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
      }, 15000);
      const linha = dados?.sources_to_targets?.[0] || [];
      for (const celula of linha) {
        const unidade = unidades[celula.to_index];
        if (unidade && celula.distance != null) {
          unidade.distanciaRotaKm = celula.distance;
          unidade.tempoMin = Math.round(celula.time / 60);
        }
      }
    } catch {
      // segue com a distância em linha reta
    }
    return unidades.sort(
      (a, b) => (a.distanciaRotaKm ?? a.distanciaKm * 1.3) - (b.distanciaRotaKm ?? b.distanciaKm * 1.3)
    );
  }

  async function proximas(origem, modo) {
    const municipio = await municipioDe(origem);
    // Na primeira busca de uma cidade grande o download do CNES pode passar de 1 minuto.
    // Em vez de deixar o app esperando até estourar o tempo, respondemos 503 "preparando"
    // e o download continua; o app tenta de novo sozinho em alguns segundos.
    const unidades = await comPrazo(unidadesDoMunicipio(municipio.codigo), PRAZO_CNES_MS, () =>
      erroHttp(503, `Preparando a lista de UBSs de ${municipio.nome || 'sua cidade'} pela primeira vez…`, { preparando: true })
    );
    const maisPerto = (lista, quantidade) =>
      lista
        .map((u) => ({ ...u, distanciaKm: Number(distanciaKm(origem, u).toFixed(2)) }))
        .filter((u) => u.distanciaKm <= RAIO_MAXIMO_KM)
        .sort((a, b) => a.distanciaKm - b.distanciaKm)
        .slice(0, quantidade);
    // Pega folga de candidatos, porque as unidades corrigidas podem mudar de lugar.
    const { unidades: candidatas, pendentes } = await corrigirSuspeitas(maisPerto(unidades, MAX_RESULTADOS * 2), municipio);
    const perto = maisPerto(candidatas, MAX_RESULTADOS);
    return {
      municipio: municipio.nome,
      fonte: 'CNES - Ministério da Saúde',
      // Unidades ainda em conferência: o app busca de novo em alguns segundos para incluí-las.
      pendentes,
      unidades: await ordenarPorRota(origem, perto, modo),
    };
  }

  async function rota(origem, destino, modo) {
    const corpo = {
      locations: [origem, destino],
      costing: modo,
      directions_options: { language: 'pt-BR', units: 'kilometers' },
    };
    let dados;
    try {
      dados = await buscarJson(`${VALHALLA_URL}/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
      }, 20000);
    } catch (erro) {
      // Erros conhecidos do Valhalla viram mensagens claras para a pessoa.
      const codigo = erro.corpo?.error_code;
      if (codigo === 154)
        throw erroHttp(422, 'Essa unidade está longe demais para traçar a rota por aqui. Use "Abrir no app de mapas".');
      if (codigo >= 170 && codigo <= 172)
        throw erroHttp(404, 'Não encontramos um caminho até essa unidade. Tente "Abrir no app de mapas".');
      if (erro.name === 'TimeoutError' || erro.name === 'AbortError')
        throw erroHttp(504, 'O serviço de rotas demorou para responder. Tente de novo em instantes.');
      if (erro.status) throw erroHttp(502, 'O serviço de rotas está indisponível agora. Tente de novo em instantes.');
      throw erro;
    }
    const perna = dados?.trip?.legs?.[0];
    if (!perna) throw erroHttp(404, 'Não encontramos um caminho até essa unidade.');
    return {
      distanciaKm: dados.trip.summary.length,
      tempoMin: Math.round(dados.trip.summary.time / 60),
      pontos: decodificarPolyline(perna.shape),
      passos: (perna.maneuvers || []).map((m) => ({
        instrucao: m.instruction,
        distanciaKm: m.length,
      })),
    };
  }

  return { proximas, rota };
}

function criarProxyUbs(fetchApi = fetch) {
  const servico = criarServicoUbs(fetchApi);

  return async function proxyUbs(req, res, next) {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith('/api/ubs/')) return next();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }
    if (req.method !== 'GET') {
      res.writeHead(405, { Allow: 'GET, OPTIONS' });
      return res.end();
    }

    const responder = (status, corpo) => {
      res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(corpo));
    };

    try {
      const modo = MODOS[url.searchParams.get('modo')] || MODOS.pe;
      const origem = lerCoordenada(url.searchParams.get('origem'));
      if (!origem) throw erroHttp(400, 'Localização inválida.');

      if (url.pathname === '/api/ubs/proximas') {
        return responder(200, await servico.proximas(origem, modo));
      }
      if (url.pathname === '/api/ubs/rota') {
        const destino = lerCoordenada(url.searchParams.get('destino'));
        if (!destino) throw erroHttp(400, 'Destino inválido.');
        return responder(200, await servico.rota(origem, destino, modo));
      }
      return responder(404, { error: 'Rota não encontrada.' });
    } catch (erro) {
      const status = erro.status || 502;
      if (status >= 500 && !erro.extras?.preparando) {
        // Aparece no terminal do Metro/Express para facilitar o diagnóstico.
        console.warn(`[UBS] ${url.pathname} falhou: ${erro.message}`);
      }
      return responder(status, {
        error: erro.status ? erro.message : 'Não foi possível consultar as UBSs agora. Tente novamente.',
        ...(erro.extras || {}),
      });
    }
  };
}

module.exports = { criarProxyUbs, criarServicoUbs, decodificarPolyline, distanciaKm };
