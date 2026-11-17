// Calcula a situação de cada recomendação do calendário a partir da data de
// nascimento do paciente e das aplicações registradas.
//
// Situações exibidas: aplicada, pendente, atrasada e não iniciada.
// Nenhum cálculo aqui é diagnóstico ou prescrição: a caderneta e a equipe da
// unidade de saúde são sempre a referência final.

import color from "../../screen/Colors/cor";
import { FAIXAS } from "./calendarioVacinas";

export const SITUACOES = {
  aplicada: { rotulo: "Aplicada", fundo: color.colorModelFive, texto: color.colorModelFour },
  pendente: { rotulo: "Pendente", fundo: color.colorModelTwo, texto: color.colorModelOne },
  atrasada: { rotulo: "Atrasada", fundo: "#FDECEC", texto: color.vermelho },
  nao_iniciada: { rotulo: "Não iniciada", fundo: color.fundo, texto: color.textoSuave },
};

// Dias de tolerância depois da data prevista antes de considerar a dose atrasada.
const TOLERANCIA_DIAS = 30;
const DIA_MS = 24 * 60 * 60 * 1000;

// ---------- Datas ----------

export const isoParaData = (iso) => {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d);
};
const dois = (n) => String(n).padStart(2, "0");
export const dataParaIso = (data) => `${data.getFullYear()}-${dois(data.getMonth() + 1)}-${dois(data.getDate())}`;
export const somarMeses = (data, meses) => new Date(data.getFullYear(), data.getMonth() + meses, data.getDate());

export const idadeEmMeses = (nascimentoIso, em = new Date()) => {
  const n = isoParaData(nascimentoIso);
  let meses = (em.getFullYear() - n.getFullYear()) * 12 + (em.getMonth() - n.getMonth());
  if (em.getDate() < n.getDate()) meses -= 1;
  return Math.max(0, meses);
};

export const descreverIdade = (meses) => {
  if (meses < 1) return "Menos de 1 mês";
  if (meses < 24) return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  const anos = Math.floor(meses / 12);
  return `${anos} anos`;
};

export const faixaDaIdade = (meses) =>
  FAIXAS.find((f) => meses >= f.deMeses && (f.ateMeses == null || meses <= f.ateMeses))?.valor ?? "adulto";

// ---------- Cálculo ----------

const registrosDe = (aplicacoes, chaves, nascimentoIso) =>
  aplicacoes
    .filter((a) => chaves.includes(a.vacina))
    .map((a) => ({ ...a, idadeMeses: idadeEmMeses(nascimentoIso, isoParaData(a.data)) }))
    .sort((a, b) => a.data.localeCompare(b.data));

function situacaoDaDose(prevista, limite, hoje) {
  if (limite && hoje > limite) return "encerrada";
  if (prevista > hoje) return "pendente";
  if (hoje - prevista > TOLERANCIA_DIAS * DIA_MS) return "atrasada";
  return "pendente"; // é a época de tomar
}

// Regra "idade": doses em idades definidas, cada uma com limite de idade.
function calcularPorIdade(regra, nascimento, nascimentoIso, aplicacoes, hoje) {
  const registros = registrosDe(aplicacoes, regra.chaves, nascimentoIso);
  const usados = new Set();
  const doses = regra.doses.map((dose) => {
    const prevista = somarMeses(nascimento, dose.meses);
    const limite = dose.limiteMeses != null ? somarMeses(nascimento, dose.limiteMeses + 1) : null;
    const registro = registros.find(
      (r) =>
        !usados.has(r.id) &&
        r.idadeMeses >= (dose.desdeMeses ?? 0) &&
        (dose.limiteMeses == null || r.idadeMeses <= dose.limiteMeses)
    );
    if (registro) {
      usados.add(registro.id);
      return { ...dose, prevista, situacao: "aplicada", registro };
    }
    return { ...dose, prevista, limite, situacao: situacaoDaDose(prevista, limite, hoje) };
  });

  const aplicadas = doses.filter((d) => d.situacao === "aplicada");
  const restantes = doses.filter((d) => d.situacao !== "aplicada" && d.situacao !== "encerrada");
  const encerradas = doses.filter((d) => d.situacao === "encerrada");
  const proxima = restantes[0] || null;

  let situacao;
  if (restantes.some((d) => d.situacao === "atrasada")) situacao = "atrasada";
  else if (restantes.length === 0) situacao = aplicadas.length ? "aplicada" : "nao_iniciada";
  else situacao = aplicadas.length || (proxima && proxima.prevista <= hoje) ? "pendente" : "nao_iniciada";

  let nota = null;
  if (encerradas.length && !restantes.length && aplicadas.length < doses.length)
    nota = "O prazo de idade para as doses que faltam já terminou. Confira a caderneta com a unidade de saúde.";

  return {
    situacao,
    doses,
    ultima: aplicadas[aplicadas.length - 1]?.registro ?? null,
    proximaData: proxima ? (proxima.situacao === "atrasada" ? hoje : proxima.prevista) : null,
    proximaAtrasada: proxima?.situacao === "atrasada",
    proximaRotulo: proxima?.rotulo ?? null,
    nota,
  };
}

// Regra "periodica": doses repetidas (anual, a cada 6 meses, a cada 10 anos).
function calcularPeriodica(regra, nascimento, nascimentoIso, aplicacoes, hoje) {
  const registros = registrosDe(aplicacoes, regra.chaves, nascimentoIso);
  const inicio = somarMeses(nascimento, regra.inicioMeses);
  const fim = regra.fimMeses != null ? somarMeses(nascimento, regra.fimMeses + 1) : null;
  const ultima = registros[registros.length - 1] ?? null;
  const base = { doses: null, ultima, nota: null, proximaRotulo: "Próxima dose" };

  if (hoje < inicio) return { ...base, situacao: "nao_iniciada", proximaData: inicio, proximaAtrasada: false };
  if (fim && hoje >= fim) {
    return {
      ...base,
      situacao: registros.some((r) => r.idadeMeses >= regra.inicioMeses) ? "aplicada" : "nao_iniciada",
      proximaData: null,
      proximaAtrasada: false,
      nota: "A faixa de idade desta recomendação já terminou.",
    };
  }
  if (!ultima) {
    // Sem registro: periódicas por idade (gripe, covid no idoso) vencem ao entrar na faixa;
    // reforços que dependem do esquema anterior (dT) ficam "não iniciada" até haver registro.
    if (regra.exigeRegistro) {
      return { ...base, situacao: "nao_iniciada", proximaData: null, proximaAtrasada: false,
        nota: "Sem registro de vacina contra difteria e tétano. Procure a unidade de saúde para avaliar o esquema." };
    }
    const atrasada = hoje - inicio > TOLERANCIA_DIAS * DIA_MS;
    return { ...base, situacao: atrasada ? "atrasada" : "pendente", proximaData: hoje, proximaAtrasada: atrasada };
  }
  const proxima = somarMeses(isoParaData(ultima.data), regra.periodoMeses);
  if (proxima > hoje) return { ...base, situacao: "aplicada", proximaData: proxima, proximaAtrasada: false };
  const atrasada = hoje - proxima > TOLERANCIA_DIAS * DIA_MS;
  return { ...base, situacao: atrasada ? "atrasada" : "pendente", proximaData: atrasada ? hoje : proxima, proximaAtrasada: atrasada };
}

// Regra "esquema": completar um número de doses (atualização da caderneta).
function calcularEsquema(regra, nascimento, nascimentoIso, aplicacoes, hoje, idadeAtual) {
  const registros = registrosDe(aplicacoes, regra.chaves, nascimentoIso);
  const necessarias =
    typeof regra.dosesNecessarias === "function" ? regra.dosesNecessarias(idadeAtual) : regra.dosesNecessarias;
  const completo = regra.completo
    ? regra.completo(registros.map((r) => r.idadeMeses))
    : registros.length >= necessarias;
  const ultima = registros[registros.length - 1] ?? null;
  const base = { doses: null, ultima, nota: null, proximaRotulo: "Próxima dose" };
  const inicio = somarMeses(nascimento, regra.deMeses);
  const fim = regra.ateMeses != null ? somarMeses(nascimento, regra.ateMeses + 1) : null;

  if (completo) return { ...base, situacao: "aplicada", proximaData: null, proximaAtrasada: false };
  if (hoje < inicio) return { ...base, situacao: "nao_iniciada", proximaData: inicio, proximaAtrasada: false };
  if (fim && hoje >= fim) {
    return { ...base, situacao: "nao_iniciada", proximaData: null, proximaAtrasada: false,
      nota: "A faixa de idade desta atualização já terminou." };
  }
  if (!registros.length) {
    return { ...base, situacao: "nao_iniciada", proximaData: null, proximaAtrasada: false,
      nota: "Sem registro de doses. Se você não tem o esquema completo, procure a unidade de saúde." };
  }
  // Já começou: a próxima dose segue o prazo a partir da 1ª dose (ex.: 0, 1 e 6 meses).
  const prazos = regra.prazosMeses ?? [];
  const primeira = isoParaData(registros[0].data);
  const proxima = prazos[registros.length] != null ? somarMeses(primeira, prazos[registros.length]) : hoje;
  const atrasada = hoje - proxima > TOLERANCIA_DIAS * DIA_MS;
  return { ...base, situacao: atrasada ? "atrasada" : "pendente", proximaData: atrasada ? hoje : proxima, proximaAtrasada: atrasada,
    proximaRotulo: `${registros.length + 1}ª dose` };
}

// Regra "especial": a indicação depende do grupo; o app só mostra o que foi registrado.
function calcularEspecial(regra, nascimentoIso, aplicacoes) {
  const registros = registrosDe(aplicacoes, regra.chaves, nascimentoIso);
  return {
    situacao: registros.length ? "aplicada" : "nao_iniciada",
    doses: null,
    ultima: registros[registros.length - 1] ?? null,
    proximaData: null,
    proximaAtrasada: false,
    proximaRotulo: null,
    nota: "Indicada só para o grupo descrito. Converse com a equipe de saúde se você faz parte dele.",
  };
}

export function calcularSituacao(recomendacao, nascimentoIso, aplicacoes, hoje = new Date()) {
  if (!nascimentoIso) {
    return { situacao: "nao_iniciada", doses: null, ultima: null, proximaData: null, proximaAtrasada: false, nota: null };
  }
  const nascimento = isoParaData(nascimentoIso);
  const idadeAtual = idadeEmMeses(nascimentoIso, hoje);
  const { regra } = recomendacao;
  // Registros só contam para a faixa a que pertencem? Não: uma dose vale para a pessoa,
  // independentemente da aba. As regras filtram por vacina e idade de aplicação.
  if (regra.tipo === "idade") return calcularPorIdade(regra, nascimento, nascimentoIso, aplicacoes, hoje);
  if (regra.tipo === "periodica") return calcularPeriodica(regra, nascimento, nascimentoIso, aplicacoes, hoje);
  if (regra.tipo === "esquema") return calcularEsquema(regra, nascimento, nascimentoIso, aplicacoes, hoje, idadeAtual);
  return calcularEspecial(regra, nascimentoIso, aplicacoes);
}
