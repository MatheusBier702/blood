import color from "../../screen/Colors/cor";
import {
  PERIODOS,
  agoraHora,
  dataParaIso,
  filtrarPeriodo,
  formatarData,
  formatarDataHora,
  hojeTexto,
  horaValida,
  inicioDoPeriodo,
  maisRecentePrimeiro,
  mascaraData,
  mascaraHora,
  momentoDaMedicao,
} from "../Glicemia/dadosGlicemia";

// Datas, horários e períodos: as mesmas funções das abas Glicemia e Alergias.
export {
  PERIODOS,
  agoraHora,
  dataParaIso,
  filtrarPeriodo,
  formatarData,
  formatarDataHora,
  hojeTexto,
  horaValida,
  inicioDoPeriodo,
  maisRecentePrimeiro,
  mascaraData,
  mascaraHora,
  momentoDaMedicao,
};

// Opções fixas. O "valor" vai para o banco; o "rotulo" aparece na tela.
export const CONTEXTOS = [
  { valor: "repouso", rotulo: "Em repouso" },
  { valor: "apos_atividade", rotulo: "Após atividade física" },
  { valor: "apos_refeicao", rotulo: "Após refeição" },
  { valor: "apos_medicamento", rotulo: "Após medicamento" },
  { valor: "outro", rotulo: "Outro" },
];

export const BRACOS = [
  { valor: "esquerdo", rotulo: "Esquerdo" },
  { valor: "direito", rotulo: "Direito" },
];

// Sintomas que, junto com a pressão, pedem atendimento imediato.
export const SINTOMAS = [
  { valor: "dor_peito", rotulo: "Dor ou aperto no peito" },
  { valor: "falta_ar", rotulo: "Falta de ar" },
  { valor: "dor_cabeca", rotulo: "Dor de cabeça forte" },
  { valor: "visao", rotulo: "Alteração na visão" },
  { valor: "fraqueza", rotulo: "Fraqueza ou dormência" },
  { valor: "fala", rotulo: "Confusão ou dificuldade para falar" },
  { valor: "tontura", rotulo: "Tontura ou desmaio" },
];

const rotuloDe = (lista, valor) => lista.find((item) => item.valor === valor)?.rotulo ?? "—";
export const rotuloContexto = (valor) => rotuloDe(CONTEXTOS, valor);
export const rotuloBraco = (valor) => rotuloDe(BRACOS, valor);
export const rotuloSintoma = (valor) => rotuloDe(SINTOMAS, valor);

// ---------- Limites ----------
// Limites de VALIDAÇÃO: só barram números impossíveis de medir (erro de digitação).
// Valores fora do habitual continuam podendo ser registrados.
export const LIMITES = {
  sistolica: { minimo: 50, maximo: 300 },
  diastolica: { minimo: 20, maximo: 200 },
  frequencia: { minimo: 20, maximo: 250 },
};

// Referências clínicas usadas só para ORIENTAÇÃO DE SEGURANÇA (não para diagnóstico):
// pressão ≥ 180/120 mmHg é considerada muito elevada pelas diretrizes (SBC 2020, AHA);
// abaixo de 90/60 mmHg é considerada baixa.
export const REFERENCIAS = {
  muitoElevada: { sistolica: 180, diastolica: 120 },
  baixa: { sistolica: 90, diastolica: 60 },
};

// Faixa "habitual" usada só para pedir que a pessoa confira o que digitou.
export const valorIncomum = (sistolica, diastolica) =>
  sistolica > 220 || sistolica < 80 || diastolica > 130 || diastolica < 45;

// ---------- Formatação ----------

export const formatarPressao = (m) => `${m.sistolica}/${m.diastolica}`;
export const formatarFrequencia = (m) => (m.frequencia != null ? `${m.frequencia} bpm` : null);

// ---------- Cálculos ----------
// Cada média usa só os registros que têm aquele dado (a frequência cardíaca é
// opcional e nunca entra como zero).

const resumoDe = (valores) => {
  const validos = valores.filter((v) => Number.isFinite(v));
  if (!validos.length) return { quantidade: 0, media: null, menor: null, maior: null };
  return {
    quantidade: validos.length,
    media: validos.reduce((soma, v) => soma + v, 0) / validos.length,
    menor: Math.min(...validos),
    maior: Math.max(...validos),
  };
};

// Registro com o maior/menor valor de um campo (para mostrar data e hora).
const extremo = (lista, campo, maior) =>
  lista.reduce((atual, item) => {
    if (!Number.isFinite(item[campo])) return atual;
    if (!atual) return item;
    return maior ? (item[campo] > atual[campo] ? item : atual) : item[campo] < atual[campo] ? item : atual;
  }, null);

export const estatisticasPressao = (lista) => ({
  quantidade: lista.length,
  sistolica: resumoDe(lista.map((m) => m.sistolica)),
  diastolica: resumoDe(lista.map((m) => m.diastolica)),
  frequencia: resumoDe(lista.map((m) => m.frequencia)),
  maiorSistolica: extremo(lista, "sistolica", true),
  menorSistolica: extremo(lista, "sistolica", false),
  maiorDiastolica: extremo(lista, "diastolica", true),
  menorDiastolica: extremo(lista, "diastolica", false),
});

// A média só aparece com pelo menos 2 medições, para não confundir uma medição isolada com média.
export const MINIMO_PARA_MEDIA = 2;
export const mediaFormatada = (est) =>
  est.quantidade >= MINIMO_PARA_MEDIA
    ? `${Math.round(est.sistolica.media)}/${Math.round(est.diastolica.media)}`
    : null;

const dois = (n) => String(n).padStart(2, "0");
export const isoDe = (d) => `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;

// Médias por semana do período (evolução no relatório), da mais antiga para a mais recente.
export const semanasPressao = (lista, dias, agora = new Date()) => {
  const inicio = inicioDoPeriodo(dias, agora);
  const semanas = [];
  for (let i = 0; i * 7 < dias; i += 1) {
    const de = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i * 7);
    const limite = new Date(de.getFullYear(), de.getMonth(), de.getDate() + 7);
    const ate = new Date(limite.getFullYear(), limite.getMonth(), limite.getDate() - 1);
    const daSemana = lista.filter((m) => {
      const quando = momentoDaMedicao(m);
      return quando >= de && quando < limite;
    });
    semanas.push({ de: isoDe(de), ate: isoDe(ate > agora ? agora : ate), ...estatisticasPressao(daSemana) });
  }
  return semanas;
};

// ---------- Metas individuais ----------
// Cadastradas a partir do que o profissional de saúde definiu. Não existe meta padrão.
// Formato: { sistolica: { minimo, maximo }, diastolica: { minimo, maximo }, profissional, definidaEm }

export const temMetaValor = (meta) => !!meta && (meta.minimo != null || meta.maximo != null);
export const temMetas = (metas) => temMetaValor(metas?.sistolica) || temMetaValor(metas?.diastolica);

export const descreverMeta = (meta) => {
  if (!temMetaValor(meta)) return "Sem meta definida";
  if (meta.minimo != null && meta.maximo != null) return `${meta.minimo} a ${meta.maximo} mmHg`;
  if (meta.minimo != null) return `A partir de ${meta.minimo} mmHg`;
  return `Até ${meta.maximo} mmHg`;
};

const foraDe = (valor, meta) =>
  temMetaValor(meta) && ((meta.minimo != null && valor < meta.minimo) || (meta.maximo != null && valor > meta.maximo));

// Devolve null quando não há metas; senão true/false.
export const foraDaMeta = (m, metas) => {
  if (!temMetas(metas)) return null;
  return foraDe(m.sistolica, metas.sistolica) || foraDe(m.diastolica, metas.diastolica);
};

// ---------- Alertas ----------
// Cada medição pode gerar um alerta. A ordem define a prioridade.
// Nenhum alerta é diagnóstico: são avisos para repetir a medição, procurar ajuda ou
// conversar com o profissional de saúde.

export const TIPOS_ALERTA = {
  urgente: {
    rotulo: "Procure atendimento imediato",
    fundo: "#FDECEC",
    texto: color.vermelho,
    orientacao:
      "Pressão muito elevada ou acompanhada de sintomas preocupantes. Procure um pronto-socorro agora ou ligue 192 (SAMU). Não espere a pressão baixar sozinha e não tome remédios por conta própria.",
  },
  muito_elevada: {
    rotulo: "Pressão muito elevada",
    fundo: "#FDECEC",
    texto: color.vermelho,
    orientacao:
      "Fique em repouso por 5 minutos e meça de novo. Se continuar igual ou maior a 180/120 mmHg, procure atendimento médico. Se surgir dor no peito, falta de ar, dor de cabeça forte, alteração na visão, fraqueza ou dificuldade para falar, ligue 192 (SAMU).",
  },
  baixa: {
    rotulo: "Pressão baixa",
    fundo: color.colorModelTwo,
    texto: color.colorModelOne,
    orientacao:
      "Sente ou deite e meça de novo. Se houver tontura, desmaio ou mal-estar, procure atendimento. Converse com seu médico, principalmente se você usa remédios para pressão.",
  },
  fora_meta: {
    rotulo: "Fora da sua meta",
    fundo: color.colorModelTwo,
    texto: color.colorModelOne,
    orientacao:
      "Essa medição ficou fora da meta definida pelo seu profissional de saúde. Uma medição isolada não é diagnóstico: continue registrando e leve o histórico para a próxima consulta.",
  },
};

export const ORDEM_ALERTAS = ["urgente", "muito_elevada", "baixa", "fora_meta"];

export const alertaDaMedicao = (m, metas) => {
  const muitoElevada =
    m.sistolica >= REFERENCIAS.muitoElevada.sistolica || m.diastolica >= REFERENCIAS.muitoElevada.diastolica;
  // Sintomas preocupantes pedem atendimento imediato com qualquer valor de pressão
  // (podem indicar uma emergência mesmo quando a pressão não está alterada).
  if ((m.sintomas || []).length > 0) return "urgente";
  if (muitoElevada) return "muito_elevada";
  if (m.sistolica < REFERENCIAS.baixa.sistolica || m.diastolica < REFERENCIAS.baixa.diastolica) return "baixa";
  if (foraDaMeta(m, metas)) return "fora_meta";
  return null;
};

// ---------- Dados de exemplo ----------
// Servem só para demonstrar a aba enquanto o backend não existe. São gerados em relação
// a hoje para que os filtros de 7, 30 e 90 dias sempre tenham dados.

export const gerarMedicoesExemplo = (agora = new Date()) => {
  const lista = [];
  let n = 0;
  for (let dia = 0; dia < 88; dia += dia < 14 ? 1 : 3) {
    const data = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - dia);
    const horarios = dia < 14 ? ["07:30", "20:00"] : ["07:30"];
    horarios.forEach((hora, i) => {
      const [h, min] = hora.split(":").map(Number);
      const quando = new Date(data);
      quando.setHours(h, min);
      if (quando > agora) return;
      // Variação determinística (sem Math.random) para o exemplo ser sempre igual.
      const onda = Math.sin((dia + 1) * 1.3 + i * 2.1);
      const tendencia = dia > 45 ? 6 : 0;
      n += 1;
      lista.push({
        id: `p${n}`,
        sistolica: Math.round(126 + onda * 11 + Math.cos(dia * 0.7) * 5 + tendencia),
        diastolica: Math.round(81 + onda * 7 + Math.sin(dia * 0.5) * 3 + tendencia / 2),
        frequencia: dia % 5 === 3 ? null : Math.round(72 + Math.cos((dia + i) * 1.1) * 8),
        data: isoDe(data),
        hora,
        contexto: i === 1 && dia % 4 === 1 ? "apos_refeicao" : dia % 9 === 2 ? "apos_atividade" : "repouso",
        braco: dia % 6 === 5 ? "direito" : "esquerdo",
        sintomas: [],
        observacoes: dia === 6 && i === 0 ? "Noite mal dormida." : dia === 20 ? "Esqueci o remédio no dia anterior." : "",
      });
    });
  }
  // Uma medição bem elevada para demonstrar os alertas.
  const ontem = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - 2);
  lista.push({
    id: `p${n + 1}`,
    sistolica: 182,
    diastolica: 112,
    frequencia: 88,
    data: isoDe(ontem),
    hora: "15:40",
    contexto: "outro",
    braco: "esquerdo",
    sintomas: [],
    observacoes: "Medi depois de uma discussão no trabalho. Repeti 10 minutos depois: 148/94.",
  });
  return lista;
};
