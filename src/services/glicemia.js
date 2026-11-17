// Camada de dados da aba Glicemia (mesmo padrão de src/services/alergias.js).
//
// Por enquanto os dados ficam em memória: as medições começam com os exemplos
// de dadosGlicemia.js e as metas começam vazias (não existe meta padrão; cada
// paciente cadastra as suas). Todas as funções já são assíncronas e devolvem o
// formato que o backend deve devolver. Para integrar com o servidor Express,
// troque o corpo de cada função pela chamada da `api` (src/services/api.js):
//
//   export const listarMedicoes = async () => (await api.get("/api/glicemias")).data;
//   export const salvarMedicao = async (dados) =>
//     dados.id
//       ? (await api.put(`/api/glicemias/${dados.id}`, dados)).data
//       : (await api.post("/api/glicemias", dados)).data;
//   export const buscarMetas = async () => (await api.get("/api/glicemias/metas")).data;
//   export const salvarMetas = async (metas) => (await api.put("/api/glicemias/metas", metas)).data;

import { gerarMedicoesExemplo } from "../pages/Glicemia/dadosGlicemia";

const banco = {
  medicoes: gerarMedicoesExemplo(),
  // { jejum: { minimo, maximo }, antes_refeicao: ..., apos_refeicao: ..., antes_dormir: ... }
  metas: {},
};

let contador = 0;
const novoId = () => `g${Date.now().toString(36)}${(contador += 1)}`;

export const listarMedicoes = async () => banco.medicoes.map((item) => ({ ...item }));

export const salvarMedicao = async (dados) => {
  if (dados.id) {
    banco.medicoes = banco.medicoes.map((item) => (item.id === dados.id ? { ...item, ...dados } : item));
    return { ...banco.medicoes.find((item) => item.id === dados.id) };
  }
  const nova = { ...dados, id: novoId() };
  banco.medicoes = [nova, ...banco.medicoes];
  return { ...nova };
};

export const removerMedicao = async (id) => {
  banco.medicoes = banco.medicoes.filter((item) => item.id !== id);
  return { ok: true };
};

export const buscarMetas = async () => JSON.parse(JSON.stringify(banco.metas));

export const salvarMetas = async (metas) => {
  banco.metas = JSON.parse(JSON.stringify(metas));
  return buscarMetas();
};
