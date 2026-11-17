// Camada de dados da aba Alergias.
//
// Por enquanto os dados ficam em memória (começando com os exemplos de
// dadosAlergias.js), então continuam lá enquanto o app estiver aberto, mesmo
// saindo e voltando para a aba. Todas as funções já são assíncronas e devolvem
// o mesmo formato que o backend deve devolver: para integrar com o servidor
// Express basta trocar o corpo de cada função pela chamada da `api`
// (src/services/api.js), por exemplo:
//
//   export const listarAlergias = async () => (await api.get("/api/alergias")).data;
//   export const salvarAlergia = async (dados) =>
//     dados.id
//       ? (await api.put(`/api/alergias/${dados.id}`, dados)).data
//       : (await api.post("/api/alergias", dados)).data;
//
// Documentos com arquivo devem ir como multipart/form-data (campo "arquivo").

import {
  ALERGIAS_EXEMPLO,
  REACOES_EXEMPLO,
  DOCUMENTOS_EXEMPLO,
  INFORMACOES_EXEMPLO,
} from "../pages/Alergias/dadosAlergias";

const banco = {
  alergias: ALERGIAS_EXEMPLO.map((item) => ({ ...item })),
  reacoes: REACOES_EXEMPLO.map((item) => ({ ...item })),
  documentos: DOCUMENTOS_EXEMPLO.map((item) => ({ ...item })),
  informacoes: INFORMACOES_EXEMPLO.map((item) => ({ ...item })),
};

let contador = 0;
const novoId = (prefixo) => `${prefixo}${Date.now().toString(36)}${(contador += 1)}`;
const copia = (lista) => lista.map((item) => ({ ...item }));

function salvarEm(colecao, prefixo, dados) {
  if (dados.id) {
    banco[colecao] = banco[colecao].map((item) => (item.id === dados.id ? { ...item, ...dados } : item));
    return { ...banco[colecao].find((item) => item.id === dados.id) };
  }
  const novo = { ...dados, id: novoId(prefixo) };
  banco[colecao] = [novo, ...banco[colecao]];
  return { ...novo };
}

function removerDe(colecao, id) {
  banco[colecao] = banco[colecao].filter((item) => item.id !== id);
  return { ok: true };
}

// ---------- Alergias ----------
export const listarAlergias = async () => copia(banco.alergias);
export const salvarAlergia = async (dados) => salvarEm("alergias", "a", dados);
export const removerAlergia = async (id) => {
  // Reações e documentos continuam no histórico, só perdem o vínculo.
  banco.reacoes = banco.reacoes.map((r) => (r.alergiaId === id ? { ...r, alergiaId: null } : r));
  banco.documentos = banco.documentos.map((d) => (d.alergiaId === id ? { ...d, alergiaId: null } : d));
  return removerDe("alergias", id);
};

// ---------- Histórico de reações ----------
export const listarReacoes = async () => copia(banco.reacoes);
export const salvarReacao = async (dados) => salvarEm("reacoes", "r", dados);
export const removerReacao = async (id) => removerDe("reacoes", id);

// ---------- Documentos e exames ----------
export const listarDocumentos = async () => copia(banco.documentos);
export const salvarDocumento = async (dados) => salvarEm("documentos", "d", dados);
export const removerDocumento = async (id) => removerDe("documentos", id);

// ---------- Informações importantes (alertas) ----------
export const listarInformacoes = async () => copia(banco.informacoes);
export const salvarInformacao = async (dados) => salvarEm("informacoes", "i", dados);
export const removerInformacao = async (id) => removerDe("informacoes", id);
