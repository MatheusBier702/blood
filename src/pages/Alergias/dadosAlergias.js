import color from "../../screen/Colors/cor";

// Opções fixas usadas nos formulários, filtros e etiquetas da aba Alergias.
// O "valor" é o que vai para o banco; o "rotulo" é o que aparece na tela.

export const CATEGORIAS = [
  { valor: "medicamentos", rotulo: "Medicamentos", exemplos: "Dipirona, penicilina, ibuprofeno…" },
  { valor: "alimentares", rotulo: "Alimentares", exemplos: "Leite, ovos, amendoim, frutos do mar…" },
  { valor: "ambientais", rotulo: "Ambientais", exemplos: "Ácaros, pólen, poeira, mofo…" },
  { valor: "insetos", rotulo: "Picadas de insetos", exemplos: "Abelhas, vespas, formigas…" },
  { valor: "contato", rotulo: "Contato e materiais", exemplos: "Látex, níquel, cosméticos…" },
  { valor: "outras", rotulo: "Outras", exemplos: "Qualquer outra substância" },
];

export const GRAVIDADES = [
  { valor: "leve", rotulo: "Leve" },
  { valor: "moderada", rotulo: "Moderada" },
  { valor: "grave", rotulo: "Grave" },
  { valor: "desconhecida", rotulo: "Desconhecida" },
];

export const SITUACOES = [
  { valor: "confirmada", rotulo: "Confirmada" },
  { valor: "suspeita", rotulo: "Suspeita" },
  { valor: "nao_investigada", rotulo: "Não investigada" },
];

export const TIPOS_DOCUMENTO = [
  { valor: "exame", rotulo: "Exame" },
  { valor: "laudo", rotulo: "Laudo" },
  { valor: "receita", rotulo: "Receita" },
  { valor: "outro", rotulo: "Outro" },
];

// Cores das etiquetas de gravidade, todas tiradas da paleta do app.
export const CORES_GRAVIDADE = {
  leve: { fundo: color.colorModelFive, texto: color.colorModelFour },
  moderada: { fundo: color.colorModelTwo, texto: color.colorModelOne },
  grave: { fundo: "#FDECEC", texto: color.vermelho },
  desconhecida: { fundo: color.fundo, texto: color.textoSuave },
};

const rotuloDe = (lista, valor) => lista.find((item) => item.valor === valor)?.rotulo ?? "—";

export const rotuloCategoria = (valor) => rotuloDe(CATEGORIAS, valor);
export const rotuloGravidade = (valor) => rotuloDe(GRAVIDADES, valor);
export const rotuloSituacao = (valor) => rotuloDe(SITUACOES, valor);
export const rotuloTipoDocumento = (valor) => rotuloDe(TIPOS_DOCUMENTO, valor);

// Ordem usada para mostrar as mais perigosas primeiro.
const PESO_GRAVIDADE = { grave: 0, moderada: 1, desconhecida: 2, leve: 3 };
export const ordenarPorGravidade = (lista) =>
  [...lista].sort(
    (a, b) =>
      PESO_GRAVIDADE[a.gravidade] - PESO_GRAVIDADE[b.gravidade] ||
      a.substancia.localeCompare(b.substancia, "pt-BR")
  );

// ---------- Datas ----------
// Guardamos sempre "AAAA-MM-DD" (formato do MySQL) e mostramos "DD/MM/AAAA".

export const formatarData = (iso) => {
  if (!iso) return "Não informada";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
};

// Aplica a máscara DD/MM/AAAA enquanto o usuário digita.
export const mascaraData = (texto) => {
  const numeros = texto.replace(/\D/g, "").slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
};

// Converte "DD/MM/AAAA" em "AAAA-MM-DD". Devolve null se a data não existir
// ou estiver no futuro.
export const dataParaIso = (texto) => {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!partes) return null;
  const [, dia, mes, ano] = partes.map(Number);
  const data = new Date(ano, mes - 1, dia);
  const valida =
    data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia && ano >= 1900;
  if (!valida || data > new Date()) return null;
  return `${partes[3]}-${partes[2]}-${partes[1]}`;
};

export const isoParaTexto = (iso) => (iso ? formatarData(iso) : "");

export const hojeTexto = () => {
  const hoje = new Date();
  const dois = (n) => String(n).padStart(2, "0");
  return `${dois(hoje.getDate())}/${dois(hoje.getMonth() + 1)}/${hoje.getFullYear()}`;
};

// ---------- Dados de exemplo ----------
// Servem só para demonstrar a aba enquanto o backend não existe.

export const ALERGIAS_EXEMPLO = [
  {
    id: "a1",
    substancia: "Penicilina",
    categoria: "medicamentos",
    sintomas: "Inchaço no rosto e na garganta, falta de ar e placas vermelhas pelo corpo.",
    gravidade: "grave",
    ultimaReacao: "2024-03-12",
    observacoes: "Reação anafilática. Usar outro antibiótico sempre que possível.",
    situacao: "confirmada",
  },
  {
    id: "a2",
    substancia: "Amendoim",
    categoria: "alimentares",
    sintomas: "Coceira na boca, urticária e vômitos.",
    gravidade: "grave",
    ultimaReacao: "2025-08-02",
    observacoes: "Evitar produtos com traços de amendoim.",
    situacao: "confirmada",
  },
  {
    id: "a3",
    substancia: "Dipirona",
    categoria: "medicamentos",
    sintomas: "Manchas vermelhas na pele.",
    gravidade: "moderada",
    ultimaReacao: "2023-11-20",
    observacoes: "",
    situacao: "suspeita",
  },
  {
    id: "a4",
    substancia: "Ácaros",
    categoria: "ambientais",
    sintomas: "Espirros, nariz entupido e olhos lacrimejando.",
    gravidade: "leve",
    ultimaReacao: "2026-06-15",
    observacoes: "Piora no inverno.",
    situacao: "confirmada",
  },
  {
    id: "a5",
    substancia: "Picada de abelha",
    categoria: "insetos",
    sintomas: "Inchaço grande no local da picada.",
    gravidade: "desconhecida",
    ultimaReacao: null,
    observacoes: "Nunca foi testado.",
    situacao: "nao_investigada",
  },
  {
    id: "a6",
    substancia: "Látex",
    categoria: "contato",
    sintomas: "Vermelhidão e coceira nas mãos.",
    gravidade: "leve",
    ultimaReacao: "2025-01-09",
    observacoes: "Pedir luvas sem látex em consultas e exames.",
    situacao: "suspeita",
  },
];

export const REACOES_EXEMPLO = [
  {
    id: "r1",
    alergiaId: "a2",
    substancia: "Amendoim",
    data: "2025-08-02",
    sintomas: "Urticária e vômitos após comer um doce.",
    gravidade: "grave",
    observacoes: "Atendido no pronto-socorro.",
  },
  {
    id: "r2",
    alergiaId: "a1",
    substancia: "Penicilina",
    data: "2024-03-12",
    sintomas: "Falta de ar e inchaço na garganta.",
    gravidade: "grave",
    observacoes: "Precisou de adrenalina.",
  },
  {
    id: "r3",
    alergiaId: "a4",
    substancia: "Ácaros",
    data: "2026-06-15",
    sintomas: "Crise de espirros ao limpar o armário.",
    gravidade: "leve",
    observacoes: "",
  },
];

export const DOCUMENTOS_EXEMPLO = [
  {
    id: "d1",
    titulo: "Teste de contato (patch test)",
    tipo: "exame",
    data: "2025-02-18",
    alergiaId: "a6",
    observacoes: "Resultado positivo para látex.",
    uri: null,
  },
  {
    id: "d2",
    titulo: "Laudo do alergologista",
    tipo: "laudo",
    data: "2024-04-02",
    alergiaId: "a1",
    observacoes: "Confirma alergia à penicilina.",
    uri: null,
  },
];

export const INFORMACOES_EXEMPLO = [
  { id: "i1", texto: "Leva caneta de adrenalina na bolsa." },
  { id: "i2", texto: "Contato de emergência: Maria (mãe) — (11) 99999-0000." },
];
