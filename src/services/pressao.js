// Camada de dados da aba Pressão Arterial (mesmo padrão de src/services/glicemia.js).
//
// Por enquanto os dados ficam em memória: as medições começam com os exemplos de
// dadosPressao.js e as metas começam vazias (não existe meta padrão; elas vêm do
// profissional de saúde). Todas as funções já são assíncronas e devolvem o formato
// que o backend deve devolver. Para integrar com o servidor Express, troque o
// corpo de cada função pela chamada da `api` (src/services/api.js):
//
//   export const listarMedicoes = async () => (await api.get("/api/pressao")).data;
//   export const salvarMedicao = async (dados) =>
//     dados.id
//       ? (await api.put(`/api/pressao/${dados.id}`, dados)).data
//       : (await api.post("/api/pressao", dados)).data;
//   export const buscarMetas = async () => (await api.get("/api/pressao/metas")).data;
//   export const salvarMetas = async (metas) => (await api.put("/api/pressao/metas", metas)).data;
//   export const listarAlertasVistos = async () => (await api.get("/api/pressao/alertas-vistos")).data;

import { gerarMedicoesExemplo } from "../pages/Pressao/dadosPressao";

const banco = {
  medicoes: gerarMedicoesExemplo(),
  metas: {},
  // ids das medições cujos alertas a pessoa já marcou como vistos
  alertasVistos: [],
};

let contador = 0;
const novoId = () => `p${Date.now().toString(36)}${(contador += 1)}`;
const copiar = (valor) => JSON.parse(JSON.stringify(valor));

export const listarMedicoes = async () => copiar(banco.medicoes);

export const salvarMedicao = async (dados) => {
  if (dados.id) {
    banco.medicoes = banco.medicoes.map((item) => (item.id === dados.id ? { ...item, ...dados } : item));
    // Editar a medição volta o alerta para "não visto", porque os valores podem ter mudado.
    banco.alertasVistos = banco.alertasVistos.filter((id) => id !== dados.id);
    return copiar(banco.medicoes.find((item) => item.id === dados.id));
  }
  const nova = { ...dados, id: novoId() };
  banco.medicoes = [nova, ...banco.medicoes];
  return copiar(nova);
};

export const removerMedicao = async (id) => {
  banco.medicoes = banco.medicoes.filter((item) => item.id !== id);
  banco.alertasVistos = banco.alertasVistos.filter((item) => item !== id);
  return { ok: true };
};

export const buscarMetas = async () => copiar(banco.metas);
export const salvarMetas = async (metas) => {
  banco.metas = copiar(metas);
  return buscarMetas();
};

export const listarAlertasVistos = async () => [...banco.alertasVistos];
export const marcarAlertaVisto = async (id, visto = true) => {
  banco.alertasVistos = visto
    ? [...new Set([...banco.alertasVistos, id])]
    : banco.alertasVistos.filter((item) => item !== id);
  return [...banco.alertasVistos];
};
