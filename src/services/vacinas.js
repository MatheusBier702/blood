// Camada de dados da aba Vacinas (mesmo padrão de src/services/glicemia.js).
//
// Por enquanto fica em memória, começando com um paciente de exemplo. Todas as
// funções são assíncronas e devolvem o formato que o backend deve devolver.
// Para integrar com o servidor Express, troque o corpo de cada função pela `api`
// (src/services/api.js), por exemplo:
//
//   export const buscarPerfil = async () => (await api.get("/api/vacinas/perfil")).data;
//   export const listarAplicacoes = async () => (await api.get("/api/vacinas/aplicacoes")).data;
//   export const salvarAplicacao = async (dados) =>
//     dados.id
//       ? (await api.put(`/api/vacinas/aplicacoes/${dados.id}`, dados)).data
//       : (await api.post("/api/vacinas/aplicacoes", dados)).data;
//
// Formato de uma aplicação: { id, vacina, dose, data: "AAAA-MM-DD", local, lote, observacoes }
// onde `vacina` é uma chave de VACINAS (calendarioVacinas.js).

import { gerarExemplo } from "../pages/Vacinas/dadosExemploVacinas";

const exemplo = gerarExemplo();
const banco = {
  perfil: exemplo.perfil,
  aplicacoes: exemplo.aplicacoes,
};

let contador = 0;
const novoId = () => `v${Date.now().toString(36)}${(contador += 1)}`;
const copiar = (valor) => JSON.parse(JSON.stringify(valor));

export const buscarPerfil = async () => copiar(banco.perfil);
export const salvarPerfil = async (perfil) => {
  banco.perfil = { ...banco.perfil, ...perfil };
  return copiar(banco.perfil);
};

export const listarAplicacoes = async () => copiar(banco.aplicacoes);

export const salvarAplicacao = async (dados) => {
  if (dados.id) {
    banco.aplicacoes = banco.aplicacoes.map((a) => (a.id === dados.id ? { ...a, ...dados } : a));
    return copiar(banco.aplicacoes.find((a) => a.id === dados.id));
  }
  const nova = { ...dados, id: novoId() };
  banco.aplicacoes = [nova, ...banco.aplicacoes];
  return copiar(nova);
};

export const removerAplicacao = async (id) => {
  banco.aplicacoes = banco.aplicacoes.filter((a) => a.id !== id);
  return { ok: true };
};
