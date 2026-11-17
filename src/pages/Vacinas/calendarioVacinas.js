// Calendário de vacinação usado na aba Vacinas.
//
// Fonte: Ministério da Saúde – Instrução Normativa do Calendário Nacional de
// Vacinação, Ano 2026 (https://www.gov.br/saude/pt-br/vacinacao). As idades,
// doses, intervalos e reforços abaixo foram copiados desse documento; nada foi
// estimado. Quando o calendário oficial for atualizado, ajuste só este arquivo.
//
// O calendário oficial organiza as faixas como Criança (até 9 anos), Adolescente
// e jovem (10 a 24 anos), Adulto (25 a 59 anos) e Idoso (60 anos ou mais). A aba
// usa as faixas pedidas pelo app (Adolescente 10 a 19 e Adulto 20 a 59), e cada
// recomendação continua com a idade oficial escrita por extenso.
//
// Cada recomendação tem:
//  - tipo: "rotina" (para todas as pessoas da faixa) ou "especial" (só para grupos
//    específicos, como gestantes ou pessoas com certas condições de saúde);
//  - regra: como o app calcula a situação a partir das doses registradas:
//      "idade"     – doses em idades definidas (calendário infantil), com limite de idade;
//      "periodica" – doses repetidas (ex.: anual) dentro de uma faixa de idade;
//      "esquema"   – completar um número de doses (atualização da caderneta);
//      "especial"  – só mostra o que foi registrado (indicação depende do grupo).
//  - chaves: quais registros contam para essa recomendação (ex.: a penta conta como
//    dose de hepatite B e de difteria/tétano).

export const FAIXAS = [
  { valor: "crianca", rotulo: "Criança", idade: "Do nascimento aos 9 anos", deMeses: 0, ateMeses: 119 },
  { valor: "adolescente", rotulo: "Adolescente", idade: "De 10 a 19 anos", deMeses: 120, ateMeses: 239 },
  { valor: "adulto", rotulo: "Adulto", idade: "De 20 a 59 anos", deMeses: 240, ateMeses: 719 },
  { valor: "idoso", rotulo: "Idoso", idade: "60 anos ou mais", deMeses: 720, ateMeses: null },
];

// Nomes das vacinas (chave usada nos registros de aplicação).
export const VACINAS = {
  bcg: { nome: "BCG", doencas: "Formas graves de tuberculose (miliar e meníngea)" },
  hb: { nome: "Hepatite B", doencas: "Hepatite B (e, por consequência, hepatite D)" },
  penta: {
    nome: "Penta (DTP + HB + Hib)",
    doencas: "Difteria, tétano, coqueluche, hepatite B e infecções por Haemophilus influenzae tipo b",
  },
  vip: { nome: "Poliomielite inativada (VIP)", doencas: "Poliomielite (paralisia infantil)" },
  vrh: { nome: "Rotavírus humano (VRH)", doencas: "Diarreia grave por rotavírus" },
  pneumo: {
    nome: "Pneumocócica conjugada (VPC 20 / VPC 10)",
    doencas: "Pneumonia, meningite, otite e outras doenças pelo pneumococo",
  },
  menc: { nome: "Meningocócica C (conjugada)", doencas: "Doença meningocócica pelo sorogrupo C (meningite)" },
  menacwy: {
    nome: "Meningocócica ACWY (conjugada)",
    doencas: "Doença meningocócica pelos sorogrupos A, C, W e Y (meningite)",
  },
  influenza: { nome: "Influenza (gripe)", doencas: "Gripe e suas complicações, como pneumonia" },
  covid: { nome: "Covid-19", doencas: "Formas graves de covid-19" },
  vfa: { nome: "Febre amarela", doencas: "Febre amarela" },
  scr: { nome: "Tríplice viral (SCR)", doencas: "Sarampo, caxumba e rubéola" },
  dtp: { nome: "DTP (tríplice bacteriana)", doencas: "Difteria, tétano e coqueluche" },
  vz: { nome: "Varicela", doencas: "Varicela (catapora)" },
  ha: { nome: "Hepatite A", doencas: "Hepatite A" },
  hpv: {
    nome: "HPV quadrivalente (HPV4)",
    doencas: "Infecção pelo HPV: verrugas genitais e cânceres de colo do útero, vulva, vagina, ânus, pênis, boca e orofaringe",
  },
  dengue: { nome: "Dengue", doencas: "Dengue (sorotipos 1, 2, 3 e 4)" },
  dt: { nome: "Dupla adulto (dT)", doencas: "Difteria e tétano" },
  dtpa: { nome: "dTpa (tríplice bacteriana acelular)", doencas: "Difteria, tétano e coqueluche (protege também o bebê)" },
  vsr: { nome: "Vírus sincicial respiratório (VSR)", doencas: "Bronquiolite e infecções graves por VSR no bebê" },
  vpc20: { nome: "Pneumocócica 20-valente (VPC 20)", doencas: "Pneumonia e outras doenças pelo pneumococo" },
};

// Febre amarela (Quadro 2 da Instrução Normativa): esquema completo com 1 dose
// aplicada a partir dos 5 anos ou com 2 doses antes dos 5 anos.
// Recebe as idades (em meses) em que cada dose foi aplicada.
function esquemaFebreAmarelaCompleto(idadesMeses) {
  return idadesMeses.some((m) => m >= 60) || idadesMeses.length >= 2;
}

export const RECOMENDACOES = [
  // ======================= CRIANÇA =======================
  {
    id: "c-bcg", faixa: "crianca", vacina: "bcg", tipo: "rotina",
    idade: "Ao nascer (ainda na maternidade)",
    doses: "Dose única",
    intervalo: null,
    reforco: "Não tem reforço.",
    observacao:
      "Se não for possível ao nascer, vacinar o mais breve possível. Pode ser aplicada até 4 anos, 11 meses e 29 dias. Recém-nascidos com menos de 2.000 g devem aguardar atingir esse peso.",
    regra: { tipo: "idade", chaves: ["bcg"], doses: [{ rotulo: "Dose única", meses: 0, limiteMeses: 59 }] },
  },
  {
    id: "c-hb", faixa: "crianca", vacina: "hb", tipo: "rotina",
    idade: "Ao nascer (nas primeiras 12 horas)",
    doses: "1 dose ao nascer; as demais doses contra hepatite B vêm na vacina penta (2, 4 e 6 meses)",
    intervalo: null,
    reforco: "Não tem reforço de rotina.",
    observacao: "A dose ao nascer só pode ser aplicada até 1 mês de vida. Depois disso, o esquema é feito com a penta.",
    regra: { tipo: "idade", chaves: ["hb"], doses: [{ rotulo: "Dose ao nascer", meses: 0, limiteMeses: 1 }] },
  },
  {
    id: "c-penta", faixa: "crianca", vacina: "penta", tipo: "rotina",
    idade: "2, 4 e 6 meses",
    doses: "3 doses",
    intervalo: "60 dias entre as doses (mínimo de 30 dias em situações excepcionais)",
    reforco: "Os reforços contra difteria, tétano e coqueluche são feitos com a DTP (15 meses e 4 anos).",
    observacao: "Pode ser aplicada até 6 anos, 11 meses e 29 dias para atualizar o esquema.",
    regra: {
      tipo: "idade", chaves: ["penta"],
      doses: [
        { rotulo: "1ª dose", meses: 2, limiteMeses: 83 },
        { rotulo: "2ª dose", meses: 4, limiteMeses: 83 },
        { rotulo: "3ª dose", meses: 6, limiteMeses: 83 },
      ],
    },
  },
  {
    id: "c-vip", faixa: "crianca", vacina: "vip", tipo: "rotina",
    idade: "2, 4 e 6 meses; reforços aos 15 meses e aos 4 anos",
    doses: "3 doses + 2 reforços",
    intervalo: "60 dias entre as doses; reforços com intervalo mínimo de 6 meses",
    reforco: "1º reforço aos 15 meses e 2º reforço aos 4 anos.",
    observacao: "Pode ser aplicada até 4 anos, 11 meses e 29 dias.",
    regra: {
      tipo: "idade", chaves: ["vip"],
      doses: [
        { rotulo: "1ª dose", meses: 2, limiteMeses: 59 },
        { rotulo: "2ª dose", meses: 4, limiteMeses: 59 },
        { rotulo: "3ª dose", meses: 6, limiteMeses: 59 },
        { rotulo: "1º reforço", meses: 15, limiteMeses: 59 },
        { rotulo: "2º reforço", meses: 48, limiteMeses: 59 },
      ],
    },
  },
  {
    id: "c-vrh", faixa: "crianca", vacina: "vrh", tipo: "rotina",
    idade: "2 e 4 meses (via oral)",
    doses: "2 doses",
    intervalo: "60 dias entre as doses (mínimo de 30 dias em situações excepcionais)",
    reforco: "Não tem reforço.",
    observacao:
      "Atenção aos limites: 1ª dose de 1 mês e 15 dias até 11 meses e 29 dias; 2ª dose de 3 meses e 15 dias até 23 meses e 29 dias. Fora desses prazos a vacina não pode mais ser aplicada.",
    regra: {
      tipo: "idade", chaves: ["vrh"],
      doses: [
        { rotulo: "1ª dose", meses: 2, limiteMeses: 11 },
        { rotulo: "2ª dose", meses: 4, limiteMeses: 23 },
      ],
    },
  },
  {
    id: "c-pneumo", faixa: "crianca", vacina: "pneumo", tipo: "rotina",
    idade: "2 e 4 meses; reforço aos 12 meses",
    doses: "2 doses + 1 reforço (1ª dose com VPC 20, 2ª com VPC 10, reforço com VPC 20)",
    intervalo: "60 dias entre as doses (mínimo de 30 dias em situações excepcionais)",
    reforco: "1 reforço aos 12 meses com a VPC 20.",
    observacao: "A VPC 20 está em fase de incorporação ao calendário. Pode ser aplicada até 4 anos, 11 meses e 29 dias.",
    regra: {
      tipo: "idade", chaves: ["pneumo"],
      doses: [
        { rotulo: "1ª dose", meses: 2, limiteMeses: 59 },
        { rotulo: "2ª dose", meses: 4, limiteMeses: 59 },
        { rotulo: "Reforço", meses: 12, limiteMeses: 59 },
      ],
    },
  },
  {
    id: "c-menc", faixa: "crianca", vacina: "menc", tipo: "rotina",
    idade: "3 e 5 meses",
    doses: "2 doses",
    intervalo: "60 dias entre as doses (mínimo de 30 dias em situações excepcionais)",
    reforco: "O reforço é feito aos 12 meses com a meningocócica ACWY.",
    observacao: "A meningocócica C é aplicada até 11 meses e 29 dias.",
    regra: {
      tipo: "idade", chaves: ["menc"],
      doses: [
        { rotulo: "1ª dose", meses: 3, limiteMeses: 11 },
        { rotulo: "2ª dose", meses: 5, limiteMeses: 11 },
      ],
    },
  },
  {
    id: "c-menacwy", faixa: "crianca", vacina: "menacwy", tipo: "rotina",
    idade: "12 meses",
    doses: "1 dose (reforço da meningocócica C)",
    intervalo: null,
    reforco: "Nova dose na adolescência, aos 11 anos.",
    observacao: "Se não for possível aos 12 meses, aplicar o quanto antes, até 4 anos, 11 meses e 29 dias.",
    regra: { tipo: "idade", chaves: ["menacwy"], doses: [{ rotulo: "Reforço", meses: 12, limiteMeses: 59 }] },
  },
  {
    id: "c-influenza", faixa: "crianca", vacina: "influenza", tipo: "rotina",
    idade: "De 6 meses a 5 anos, 11 meses e 29 dias",
    doses: "Doses anuais. Na primeira vez: 2 doses; nos anos seguintes: 1 dose por ano",
    intervalo: "30 dias entre as 2 doses da primeira vacinação",
    reforco: "1 dose a cada ano (temporada de gripe).",
    observacao: "Acima dessa idade, a vacina é indicada para grupos prioritários (ex.: doenças crônicas).",
    regra: { tipo: "periodica", chaves: ["influenza"], inicioMeses: 6, fimMeses: 71, periodoMeses: 12 },
  },
  {
    id: "c-covid", faixa: "crianca", vacina: "covid", tipo: "rotina",
    idade: "6, 7 e 9 meses",
    doses: "3 doses (vacina Pfizer/Comirnaty)",
    intervalo: "Mínimo de 4 semanas entre a 1ª e a 2ª dose e de 8 semanas entre a 2ª e a 3ª",
    reforco:
      "Doses periódicas não são rotina para criança saudável. Crianças com comorbidade, indígenas, quilombolas e ribeirinhas recebem 1 dose anual; imunocomprometidas, a cada 6 meses.",
    observacao: "Quem não completou até os 9 meses pode se vacinar até 4 anos, 11 meses e 29 dias.",
    regra: {
      tipo: "idade", chaves: ["covid"],
      doses: [
        { rotulo: "1ª dose", meses: 6, limiteMeses: 59 },
        { rotulo: "2ª dose", meses: 7, limiteMeses: 59 },
        { rotulo: "3ª dose", meses: 9, limiteMeses: 59 },
      ],
    },
  },
  {
    id: "c-vfa", faixa: "crianca", vacina: "vfa", tipo: "rotina",
    idade: "9 meses; reforço aos 4 anos",
    doses: "1 dose + 1 reforço",
    intervalo: "Mínimo de 30 dias entre as doses",
    reforco: "1 reforço aos 4 anos.",
    observacao:
      "Em locais com circulação confirmada do vírus, pode ser aplicada excepcionalmente entre 6 e 8 meses, após avaliação da equipe de saúde (essa dose não conta para a rotina).",
    regra: {
      tipo: "idade", chaves: ["vfa"],
      doses: [
        { rotulo: "1ª dose", meses: 9, limiteMeses: null },
        { rotulo: "Reforço", meses: 48, limiteMeses: 59 },
      ],
    },
  },
  {
    id: "c-scr", faixa: "crianca", vacina: "scr", tipo: "rotina",
    idade: "12 e 15 meses",
    doses: "2 doses",
    intervalo: "30 dias entre as doses (mínimo de 15 dias em situações excepcionais)",
    reforco: "Não tem reforço.",
    observacao: "A 2ª dose (15 meses) é aplicada junto com a 1ª dose da varicela.",
    regra: {
      tipo: "idade", chaves: ["scr"],
      doses: [
        { rotulo: "1ª dose", meses: 12, limiteMeses: null },
        { rotulo: "2ª dose", meses: 15, limiteMeses: null },
      ],
    },
  },
  {
    id: "c-dtp", faixa: "crianca", vacina: "dtp", tipo: "rotina",
    idade: "Reforços aos 15 meses e aos 4 anos",
    doses: "2 reforços (após as 3 doses de penta)",
    intervalo: "6 meses entre os 2 reforços",
    reforco: "Depois, 1 dose de dT aos 14 anos e a cada 10 anos.",
    observacao: "Os reforços podem ser aplicados até 6 anos, 11 meses e 29 dias.",
    regra: {
      tipo: "idade", chaves: ["dtp"],
      doses: [
        { rotulo: "1º reforço", meses: 15, limiteMeses: 83 },
        { rotulo: "2º reforço", meses: 48, limiteMeses: 83 },
      ],
    },
  },
  {
    id: "c-vz", faixa: "crianca", vacina: "vz", tipo: "rotina",
    idade: "15 meses e 4 anos",
    doses: "2 doses",
    intervalo: null,
    reforco: "Não tem reforço.",
    observacao: "Para quem não teve catapora (ou na dúvida). Pode ser aplicada até 6 anos, 11 meses e 29 dias.",
    regra: {
      tipo: "idade", chaves: ["vz"],
      doses: [
        { rotulo: "1ª dose", meses: 15, limiteMeses: 83 },
        { rotulo: "2ª dose", meses: 48, limiteMeses: 83 },
      ],
    },
  },
  {
    id: "c-ha", faixa: "crianca", vacina: "ha", tipo: "rotina",
    idade: "15 meses",
    doses: "Dose única",
    intervalo: null,
    reforco: "Não tem reforço.",
    observacao: "Pode ser aplicada até 4 anos, 11 meses e 29 dias.",
    regra: { tipo: "idade", chaves: ["ha"], doses: [{ rotulo: "Dose única", meses: 15, limiteMeses: 59 }] },
  },
  {
    id: "c-hpv", faixa: "crianca", vacina: "hpv", tipo: "rotina",
    idade: "9 anos (meninas e meninos)",
    doses: "Dose única",
    intervalo: null,
    reforco: "Não tem reforço.",
    observacao: "A janela da vacinação de rotina vai até 14 anos, 11 meses e 29 dias. Grupos especiais têm esquemas próprios.",
    regra: { tipo: "idade", chaves: ["hpv"], doses: [{ rotulo: "Dose única", meses: 108, limiteMeses: 179 }] },
  },

  // ======================= ADOLESCENTE (10 a 19 anos) =======================
  {
    id: "a-hpv", faixa: "adolescente", vacina: "hpv", tipo: "rotina",
    idade: "De 9 a 14 anos (resgate de 15 a 19 anos)",
    doses: "Dose única",
    intervalo: null,
    reforco: "Não tem reforço.",
    observacao:
      "Quem não tomou até os 14 anos, 11 meses e 29 dias: entre 15 e 19 anos há estratégia de resgate com dose única, conforme a organização de cada estado.",
    regra: { tipo: "esquema", chaves: ["hpv"], dosesNecessarias: 1, deMeses: 108, ateMeses: 239 },
  },
  {
    id: "a-menacwy", faixa: "adolescente", vacina: "menacwy", tipo: "rotina",
    idade: "11 anos (janela de 11 a 14 anos)",
    doses: "1 dose (dose ou reforço, conforme a situação vacinal)",
    intervalo: null,
    reforco: null,
    observacao: "Aplicada entre 11 anos e 14 anos, 11 meses e 29 dias. Atenção à janela de oportunidade.",
    regra: { tipo: "idade", chaves: ["menacwy"], doses: [{ rotulo: "Dose da adolescência", meses: 132, limiteMeses: 179, desdeMeses: 132 }] },
  },
  {
    id: "a-dengue", faixa: "adolescente", vacina: "dengue", tipo: "rotina",
    idade: "10 anos (janela de 10 a 14 anos)",
    doses: "2 doses",
    intervalo: "3 meses entre as doses",
    reforco: "Não tem reforço.",
    observacao:
      "Aplicada entre 10 anos e 14 anos, 11 meses e 29 dias. Quem teve dengue deve aguardar 6 meses para iniciar o esquema. Após a vacina, a pessoa fica em observação por pelo menos 15 minutos.",
    regra: {
      tipo: "idade", chaves: ["dengue"],
      doses: [
        { rotulo: "1ª dose", meses: 120, limiteMeses: 179 },
        { rotulo: "2ª dose", meses: 123, limiteMeses: 179 },
      ],
    },
  },
  {
    id: "a-dt", faixa: "adolescente", vacina: "dt", tipo: "rotina",
    idade: "Reforço aos 14 anos",
    doses: "1 reforço (10 anos depois do 2º reforço da DTP, aos 4 anos)",
    intervalo: null,
    reforco: "Depois, 1 dose de dT a cada 10 anos (antecipar para 5 anos em caso de ferimento ou exposição de risco).",
    observacao: "Quem não tem 3 doses de vacinas contra difteria e tétano deve completar o esquema com a dT (60 dias entre as doses).",
    regra: { tipo: "idade", chaves: ["dt"], doses: [{ rotulo: "Reforço dos 14 anos", meses: 168, limiteMeses: null }] },
  },
  {
    id: "a-hb", faixa: "adolescente", vacina: "hb", tipo: "rotina",
    idade: "Atualização em qualquer idade",
    doses: "3 doses no total (contando as doses da penta)",
    intervalo: "1 mês entre a 1ª e a 2ª dose e 6 meses entre a 1ª e a 3ª (0, 1 e 6 meses)",
    reforco: "Não tem reforço de rotina.",
    observacao: "Só para quem não tem as 3 doses. Não é preciso reiniciar o esquema.",
    regra: { tipo: "esquema", chaves: ["hb", "penta"], dosesNecessarias: 3, prazosMeses: [0, 1, 6], deMeses: 120, ateMeses: null },
  },
  {
    id: "a-scr", faixa: "adolescente", vacina: "scr", tipo: "rotina",
    idade: "Atualização até 29 anos",
    doses: "2 doses no total",
    intervalo: "30 dias entre as doses",
    reforco: "Não tem reforço.",
    observacao: "Só para quem não comprova as 2 doses.",
    // A atualização desta faixa começa aos 10 anos; antes disso vale o calendário da criança.
    regra: { tipo: "esquema", chaves: ["scr"], dosesNecessarias: 2, prazosMeses: [0, 1], deMeses: 120, ateMeses: 359 },
  },
  {
    id: "a-vfa", faixa: "adolescente", vacina: "vfa", tipo: "rotina",
    idade: "Atualização até 59 anos",
    doses: "Conforme o histórico: quem tomou 1 dose antes dos 5 anos recebe 1 reforço",
    intervalo: "Mínimo de 30 dias entre as doses",
    reforco: "1 dose a partir dos 5 anos (ou 2 doses antes dos 5) completa o esquema.",
    observacao: "Quem nunca se vacinou deve procurar a unidade de saúde para atualizar a situação vacinal.",
    regra: { tipo: "esquema", chaves: ["vfa"], dosesNecessarias: 1, completo: esquemaFebreAmarelaCompleto, deMeses: 120, ateMeses: 719 },
  },
  {
    id: "a-dtpa-gest", faixa: "adolescente", vacina: "dtpa", tipo: "especial",
    grupo: "Gestantes",
    idade: "A partir da 20ª semana de gestação",
    doses: "1 dose em cada gestação",
    intervalo: null,
    reforco: "Nova dose a cada gravidez.",
    observacao: "Se não for aplicada na gestação, aplicar no pós-parto até 45 dias. Protege o bebê contra a coqueluche.",
    regra: { tipo: "especial", chaves: ["dtpa"] },
  },
  {
    id: "a-vsr-gest", faixa: "adolescente", vacina: "vsr", tipo: "especial",
    grupo: "Gestantes",
    idade: "A partir da 28ª semana de gestação",
    doses: "Dose única em cada gestação",
    intervalo: null,
    reforco: "Nova dose a cada gravidez.",
    observacao: "Protege o bebê contra formas graves de bronquiolite nos primeiros meses de vida.",
    regra: { tipo: "especial", chaves: ["vsr"] },
  },
  {
    id: "a-hpv-esp", faixa: "adolescente", vacina: "hpv", tipo: "especial",
    grupo: "Imunodeprimidos, usuários de PrEP e outros grupos prioritários",
    idade: "Imunodeprimidos de 9 a 45 anos; usuários de PrEP de 15 a 45 anos",
    doses: "3 doses",
    intervalo: "2 meses entre a 1ª e a 2ª dose e 6 meses entre a 1ª e a 3ª (0, 2 e 6 meses)",
    reforco: "Não tem reforço.",
    observacao: "Mediante prescrição médica ou comprovação do grupo. Há esquemas específicos para outros grupos prioritários.",
    regra: { tipo: "especial", chaves: ["hpv"] },
  },
  {
    id: "a-influenza-esp", faixa: "adolescente", vacina: "influenza", tipo: "especial",
    grupo: "Gestantes, pessoas com doenças crônicas e outros grupos prioritários",
    idade: "Qualquer idade dentro dos grupos prioritários",
    doses: "1 dose por temporada (anual)",
    intervalo: null,
    reforco: "Nova dose a cada ano.",
    observacao: "Inclui, entre outros, gestantes, puérperas até 45 dias, povos indígenas, quilombolas e adolescentes de 12 a 21 anos sob medidas socioeducativas.",
    regra: { tipo: "especial", chaves: ["influenza"] },
  },
  {
    id: "a-covid-esp", faixa: "adolescente", vacina: "covid", tipo: "especial",
    grupo: "Gestantes, pessoas com comorbidades ou imunocomprometidas",
    idade: "Qualquer idade dentro desses grupos",
    doses: "Gestante: 1 dose a cada gestação; comorbidade: 1 dose anual; imunocomprometido: a cada 6 meses",
    intervalo: "Mínimo de 6 meses desde a última dose",
    reforco: "Doses periódicas enquanto a pessoa fizer parte do grupo.",
    observacao: null,
    regra: { tipo: "especial", chaves: ["covid"] },
  },
  {
    id: "a-vz-esp", faixa: "adolescente", vacina: "vz", tipo: "especial",
    grupo: "Povos indígenas e trabalhadores de saúde sem histórico de catapora",
    idade: "Sem limite de idade para esses grupos",
    doses: "Conforme o histórico vacinal",
    intervalo: null,
    reforco: "Não tem reforço.",
    observacao: null,
    regra: { tipo: "especial", chaves: ["vz"] },
  },

  // ======================= ADULTO (20 a 59 anos) =======================
  {
    id: "ad-dt", faixa: "adulto", vacina: "dt", tipo: "rotina",
    idade: "A cada 10 anos",
    doses: "1 dose a cada 10 anos. Sem esquema completo: 3 doses",
    intervalo: "60 dias entre as doses do esquema básico (mínimo de 30 dias)",
    reforco: "A cada 10 anos; antecipar para 5 anos em caso de ferimento ou exposição de risco.",
    observacao: "Gestantes e profissionais de saúde seguem o esquema com a dTpa.",
    regra: { tipo: "periodica", chaves: ["dt", "dtpa", "dtp", "penta"], inicioMeses: 240, fimMeses: null, periodoMeses: 120, exigeRegistro: true },
  },
  {
    id: "ad-hb", faixa: "adulto", vacina: "hb", tipo: "rotina",
    idade: "Atualização em qualquer idade",
    doses: "3 doses no total",
    intervalo: "1 mês entre a 1ª e a 2ª dose e 6 meses entre a 1ª e a 3ª (0, 1 e 6 meses)",
    reforco: "Não tem reforço de rotina.",
    observacao: "Só para quem não tem as 3 doses. Não é preciso reiniciar o esquema.",
    regra: { tipo: "esquema", chaves: ["hb", "penta"], dosesNecessarias: 3, prazosMeses: [0, 1, 6], deMeses: 240, ateMeses: null },
  },
  {
    id: "ad-scr", faixa: "adulto", vacina: "scr", tipo: "rotina",
    idade: "Atualização até 59 anos",
    doses: "De 20 a 29 anos: 2 doses no total; de 30 a 59 anos: 1 dose",
    intervalo: "30 dias entre as doses",
    reforco: "Não tem reforço.",
    observacao: "Só para quem não comprova vacinação. Mulheres devem evitar engravidar por 1 mês após a vacina.",
    regra: { tipo: "esquema", chaves: ["scr"], dosesNecessarias: (idadeMeses) => (idadeMeses < 360 ? 2 : 1), prazosMeses: [0, 1], deMeses: 240, ateMeses: 719 },
  },
  {
    id: "ad-vfa", faixa: "adulto", vacina: "vfa", tipo: "rotina",
    idade: "Atualização até 59 anos",
    doses: "Conforme o histórico: quem tomou 1 dose antes dos 5 anos recebe 1 reforço",
    intervalo: "Mínimo de 30 dias entre as doses",
    reforco: "1 dose a partir dos 5 anos (ou 2 doses antes dos 5) completa o esquema.",
    observacao: "Quem nunca se vacinou deve procurar a unidade de saúde para atualizar a situação vacinal.",
    regra: { tipo: "esquema", chaves: ["vfa"], dosesNecessarias: 1, completo: esquemaFebreAmarelaCompleto, deMeses: 240, ateMeses: 719 },
  },
  {
    id: "ad-dtpa", faixa: "adulto", vacina: "dtpa", tipo: "especial",
    grupo: "Gestantes, puérperas e profissionais de saúde",
    idade: "Gestante: a partir da 20ª semana; puérpera: até 45 dias após o parto",
    doses: "Gestante: 1 dose em cada gestação. Profissional de saúde: 1 dose e reforço a cada 10 anos com a dTpa",
    intervalo: null,
    reforco: "Gestante: a cada gravidez. Profissional de saúde: a cada 10 anos (5 anos em caso de exposição de risco).",
    observacao: "Protege o bebê contra a coqueluche nos primeiros meses de vida.",
    regra: { tipo: "especial", chaves: ["dtpa"] },
  },
  {
    id: "ad-vsr", faixa: "adulto", vacina: "vsr", tipo: "especial",
    grupo: "Gestantes",
    idade: "A partir da 28ª semana de gestação, sem limite de idade materna",
    doses: "Dose única em cada gestação",
    intervalo: null,
    reforco: "Nova dose a cada gravidez.",
    observacao: "Protege o bebê contra formas graves de bronquiolite.",
    regra: { tipo: "especial", chaves: ["vsr"] },
  },
  {
    id: "ad-influenza", faixa: "adulto", vacina: "influenza", tipo: "especial",
    grupo: "Gestantes, puérperas, pessoas com doenças crônicas e outros grupos prioritários",
    idade: "Qualquer idade dentro dos grupos prioritários",
    doses: "1 dose por temporada (anual); gestante: 1 dose a cada gestação",
    intervalo: null,
    reforco: "Nova dose a cada ano.",
    observacao:
      "Grupos prioritários incluem trabalhadores da saúde, professores, forças de segurança, caminhoneiros, pessoas com deficiência permanente e pessoas com doenças crônicas, entre outros.",
    regra: { tipo: "especial", chaves: ["influenza"] },
  },
  {
    id: "ad-covid", faixa: "adulto", vacina: "covid", tipo: "especial",
    grupo: "Gestantes, pessoas com comorbidades ou imunocomprometidas",
    idade: "Qualquer idade dentro desses grupos",
    doses: "Gestante: 1 dose a cada gestação; comorbidade: 1 dose anual; imunocomprometido: a cada 6 meses",
    intervalo: "Mínimo de 6 meses desde a última dose",
    reforco: "Doses periódicas enquanto a pessoa fizer parte do grupo.",
    observacao: null,
    regra: { tipo: "especial", chaves: ["covid"] },
  },
  {
    id: "ad-hpv", faixa: "adulto", vacina: "hpv", tipo: "especial",
    grupo: "Imunodeprimidos, usuários de PrEP e mulheres tratadas de lesões do colo do útero",
    idade: "De 15 a 45 anos (imunodeprimidos a partir de 9 anos); tratadas de NIC 2+ independentemente da idade",
    doses: "3 doses",
    intervalo: "0, 2 e 6 meses",
    reforco: "Não tem reforço.",
    observacao: "Mediante prescrição médica ou comprovação do grupo.",
    regra: { tipo: "especial", chaves: ["hpv"] },
  },
  {
    id: "ad-vz", faixa: "adulto", vacina: "vz", tipo: "especial",
    grupo: "Povos indígenas e trabalhadores de saúde sem histórico de catapora",
    idade: "Sem limite de idade para esses grupos",
    doses: "Conforme o histórico vacinal",
    intervalo: null,
    reforco: "Não tem reforço.",
    observacao: null,
    regra: { tipo: "especial", chaves: ["vz"] },
  },

  // ======================= IDOSO (60 anos ou mais) =======================
  {
    id: "i-influenza", faixa: "idoso", vacina: "influenza", tipo: "rotina",
    idade: "A partir de 60 anos",
    doses: "1 dose por ano (a cada temporada)",
    intervalo: null,
    reforco: "Nova dose a cada ano.",
    observacao: "Idosos fazem parte do grupo de maior risco para gripe grave.",
    regra: { tipo: "periodica", chaves: ["influenza"], inicioMeses: 720, fimMeses: null, periodoMeses: 12 },
  },
  {
    id: "i-covid", faixa: "idoso", vacina: "covid", tipo: "rotina",
    idade: "A partir de 60 anos",
    doses: "1 dose a cada 6 meses, independentemente das doses anteriores",
    intervalo: "Mínimo de 6 meses desde a última dose",
    reforco: "A cada 6 meses.",
    observacao: null,
    regra: { tipo: "periodica", chaves: ["covid"], inicioMeses: 720, fimMeses: null, periodoMeses: 6 },
  },
  {
    id: "i-dt", faixa: "idoso", vacina: "dt", tipo: "rotina",
    idade: "A cada 10 anos",
    doses: "1 dose a cada 10 anos. Sem esquema completo: 3 doses",
    intervalo: "60 dias entre as doses do esquema básico",
    reforco: "A cada 10 anos; antecipar para 5 anos em caso de ferimento ou exposição de risco.",
    observacao: null,
    regra: { tipo: "periodica", chaves: ["dt", "dtpa", "dtp", "penta"], inicioMeses: 720, fimMeses: null, periodoMeses: 120, exigeRegistro: true },
  },
  {
    id: "i-hb", faixa: "idoso", vacina: "hb", tipo: "rotina",
    idade: "Atualização em qualquer idade",
    doses: "3 doses no total",
    intervalo: "0, 1 e 6 meses",
    reforco: "Não tem reforço de rotina.",
    observacao: "Só para quem não tem as 3 doses.",
    regra: { tipo: "esquema", chaves: ["hb", "penta"], dosesNecessarias: 3, prazosMeses: [0, 1, 6], deMeses: 720, ateMeses: null },
  },
  {
    id: "i-vpc20", faixa: "idoso", vacina: "vpc20", tipo: "especial",
    grupo: "Idosos a partir de 85 anos, ou de 60 a 84 anos acamados ou institucionalizados",
    idade: "A partir de 85 anos (todos os não vacinados); de 60 a 84 anos se acamado ou morador de instituição de longa permanência",
    doses: "Dose única",
    intervalo: null,
    reforco: "Não tem reforço.",
    observacao: null,
    regra: { tipo: "especial", chaves: ["vpc20"] },
  },
  {
    id: "i-vfa", faixa: "idoso", vacina: "vfa", tipo: "especial",
    grupo: "Quem nunca se vacinou e mora ou vai viajar para área com circulação do vírus",
    idade: "A partir de 60 anos, com avaliação caso a caso",
    doses: "Conforme avaliação da equipe de saúde",
    intervalo: null,
    reforco: "Quem tomou 1 dose a partir dos 5 anos é considerado vacinado.",
    observacao: "Vacinar pelo menos 10 dias antes do deslocamento, após avaliação das condições de saúde.",
    regra: { tipo: "especial", chaves: ["vfa"] },
  },
  {
    id: "i-scr", faixa: "idoso", vacina: "scr", tipo: "especial",
    grupo: "Trabalhadores de saúde sem esquema completo",
    idade: "A partir de 60 anos, com avaliação do risco-benefício",
    doses: "Conforme o histórico vacinal",
    intervalo: "Mínimo de 30 dias entre as doses",
    reforco: "Não tem reforço.",
    observacao: null,
    regra: { tipo: "especial", chaves: ["scr"] },
  },
];

export const recomendacoesDaFaixa = (faixa) => RECOMENDACOES.filter((r) => r.faixa === faixa);
export const buscarRecomendacao = (id) => RECOMENDACOES.find((r) => r.id === id);
export const nomeDaVacina = (chave) => VACINAS[chave]?.nome ?? chave;
