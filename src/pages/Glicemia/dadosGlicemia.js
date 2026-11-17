import color from "../../screen/Colors/cor";
import { dataParaIso, formatarData, hojeTexto, mascaraData } from "../Alergias/dadosAlergias";

// Datas: as mesmas funções da aba Alergias ("AAAA-MM-DD" no banco, "DD/MM/AAAA" na tela).
export { dataParaIso, formatarData, hojeTexto, mascaraData };

// Opções fixas da aba Glicemia. O "valor" vai para o banco; o "rotulo" aparece na tela.
export const MOMENTOS = [
  { valor: "jejum", rotulo: "Em jejum" },
  { valor: "antes_refeicao", rotulo: "Antes da refeição" },
  { valor: "apos_refeicao", rotulo: "Após a refeição" },
  { valor: "antes_dormir", rotulo: "Antes de dormir" },
  { valor: "outro", rotulo: "Outro momento" },
];

// Momentos que podem ter meta individual (o "outro momento" não tem).
export const MOMENTOS_COM_META = MOMENTOS.filter((item) => item.valor !== "outro");

export const PERIODOS = [
  { valor: 7, rotulo: "7 dias" },
  { valor: 30, rotulo: "30 dias" },
  { valor: 90, rotulo: "90 dias" },
];

// Faixa que os glicosímetros conseguem medir; fora dela o aparelho mostra "LO"/"HI".
export const VALOR_MINIMO = 20;
export const VALOR_MAXIMO = 600;

export const rotuloMomento = (valor) => MOMENTOS.find((item) => item.valor === valor)?.rotulo ?? "—";

// ---------- Horários ----------

export const mascaraHora = (texto) => {
  const numeros = texto.replace(/\D/g, "").slice(0, 4);
  return numeros.length <= 2 ? numeros : `${numeros.slice(0, 2)}:${numeros.slice(2)}`;
};

export const horaValida = (texto) => {
  const partes = /^(\d{2}):(\d{2})$/.exec(texto);
  return !!partes && Number(partes[1]) < 24 && Number(partes[2]) < 60;
};

const dois = (n) => String(n).padStart(2, "0");

export const agoraHora = () => {
  const agora = new Date();
  return `${dois(agora.getHours())}:${dois(agora.getMinutes())}`;
};

// Data + hora da medição como objeto Date (horário local).
export const momentoDaMedicao = (medicao) => {
  const [ano, mes, dia] = medicao.data.split("-").map(Number);
  const [hora, minuto] = (medicao.hora || "00:00").split(":").map(Number);
  return new Date(ano, mes - 1, dia, hora, minuto);
};

export const formatarDataHora = (medicao) => `${formatarData(medicao.data)} às ${medicao.hora}`;

export const formatarValor = (valor) => `${Math.round(valor)} mg/dL`;

const isoDe = (data) => `${data.getFullYear()}-${dois(data.getMonth() + 1)}-${dois(data.getDate())}`;

// ---------- Cálculos ----------

export const maisRecentePrimeiro = (a, b) => momentoDaMedicao(b) - momentoDaMedicao(a);

// Medições dos últimos `dias` dias (contando hoje), da mais antiga para a mais recente.
export const filtrarPeriodo = (medicoes, dias, agora = new Date()) => {
  const inicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - (dias - 1));
  return medicoes
    .filter((item) => {
      const quando = momentoDaMedicao(item);
      return quando >= inicio && quando <= agora;
    })
    .sort((a, b) => momentoDaMedicao(a) - momentoDaMedicao(b));
};

export const inicioDoPeriodo = (dias, agora = new Date()) =>
  new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - (dias - 1));

export const estatisticas = (lista) => {
  if (!lista.length) return { quantidade: 0, media: null, menor: null, maior: null };
  let menor = lista[0];
  let maior = lista[0];
  let soma = 0;
  for (const item of lista) {
    soma += item.valor;
    if (item.valor < menor.valor) menor = item;
    if (item.valor > maior.valor) maior = item;
  }
  return { quantidade: lista.length, media: soma / lista.length, menor, maior };
};

// Média por semana do período, da mais antiga para a mais recente (evolução no relatório).
export const mediasSemanais = (lista, dias, agora = new Date()) => {
  const inicio = inicioDoPeriodo(dias, agora);
  const semanas = [];
  for (let i = 0; i * 7 < dias; i += 1) {
    const de = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i * 7);
    const ate = new Date(de.getFullYear(), de.getMonth(), de.getDate() + 6);
    const daSemana = lista.filter((item) => {
      const quando = momentoDaMedicao(item);
      return quando >= de && quando < new Date(ate.getFullYear(), ate.getMonth(), ate.getDate() + 1);
    });
    semanas.push({
      de: isoDe(de),
      ate: isoDe(ate > agora ? agora : ate),
      ...estatisticas(daSemana),
    });
  }
  return semanas;
};

// ---------- Metas individuais ----------
// Uma meta é { minimo, maximo } em mg/dL (um dos dois pode faltar). Não existe
// meta padrão: sem meta cadastrada para o momento, a medição não é classificada.

export const temMeta = (meta) => !!meta && (meta.minimo != null || meta.maximo != null);

export const descreverMeta = (meta) => {
  if (!temMeta(meta)) return "Sem meta definida";
  if (meta.minimo != null && meta.maximo != null) return `${meta.minimo} a ${meta.maximo} mg/dL`;
  if (meta.minimo != null) return `A partir de ${meta.minimo} mg/dL`;
  return `Até ${meta.maximo} mg/dL`;
};

// Compara com a meta que o próprio paciente cadastrou. Devolve null quando não há meta.
export const compararComMeta = (medicao, metas) => {
  const meta = metas?.[medicao.momento];
  if (!temMeta(meta)) return null;
  if (meta.minimo != null && medicao.valor < meta.minimo) return "abaixo";
  if (meta.maximo != null && medicao.valor > meta.maximo) return "acima";
  return "dentro";
};

export const SITUACAO_META = {
  dentro: { rotulo: "Dentro da sua meta", fundo: color.colorModelFive, texto: color.colorModelFour },
  acima: { rotulo: "Acima da sua meta", fundo: "#FDECEC", texto: color.vermelho },
  abaixo: { rotulo: "Abaixo da sua meta", fundo: color.colorModelTwo, texto: color.colorModelOne },
};

// ---------- Dados de exemplo ----------
// Servem só para demonstrar a aba enquanto o backend não existe. São gerados em
// relação a hoje para que os filtros de 7, 30 e 90 dias sempre tenham dados.

const ROTINA = [
  { hora: "07:10", momento: "jejum", base: 96 },
  { hora: "12:00", momento: "antes_refeicao", base: 102 },
  { hora: "14:15", momento: "apos_refeicao", base: 148 },
  { hora: "22:30", momento: "antes_dormir", base: 118 },
];

const OBSERVACOES = {
  3: "Almoço com massa.",
  11: "Dormi pouco na noite anterior.",
  18: "Caminhada de 30 minutos depois do almoço.",
  26: "Festa de aniversário.",
  40: "Medição repetida para conferir o aparelho.",
};

export const gerarMedicoesExemplo = (agora = new Date()) => {
  const lista = [];
  let n = 0;
  for (let dia = 0; dia < 88; dia += dia < 14 ? 1 : 2) {
    const data = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - dia);
    // Nos dias mais antigos registramos menos medições, como acontece na vida real.
    const rotina = dia < 14 ? ROTINA : dia % 4 === 0 ? [ROTINA[0], ROTINA[2]] : [ROTINA[0]];
    rotina.forEach((item, i) => {
      const quando = new Date(data);
      const [h, m] = item.hora.split(":").map(Number);
      quando.setHours(h, m);
      if (quando > agora) return;
      // Variação determinística (sem Math.random) para o exemplo ser sempre igual.
      const variacao = Math.round(Math.sin((dia + 1) * 1.7 + i * 2.3) * 18 + Math.cos(dia * 0.45) * 7);
      n += 1;
      lista.push({
        id: `g${n}`,
        valor: item.base + variacao + (dia > 45 ? 9 : 0),
        data: isoDe(data),
        hora: item.hora,
        momento: item.momento,
        observacoes: i === 2 ? OBSERVACOES[dia] ?? "" : "",
      });
    });
  }
  return lista;
};
