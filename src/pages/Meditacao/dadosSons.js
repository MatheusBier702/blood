// Sons naturais da aba Meditação. Áudios reais com licença livre, vindos do
// Wikimedia Commons (detalhes em src/screen/assets/sons/CREDITOS.md). Cada arquivo
// é um trecho preparado para tocar em loop, sem emenda perceptível.

export const SONS_NATURAIS = [
  {
    id: "chuva",
    nome: "Chuva",
    descricao: "Som de chuva caindo, para uma atmosfera tranquila.",
    audio: require("../../screen/assets/sons/chuva.mp3"),
    icone: require("../../screen/assets/sons/chuva.png"),
    credito: "Gravity Sound · CC BY 4.0",
  },
  {
    id: "oceano",
    nome: "Oceano",
    descricao: "O vai e vem das ondas do mar.",
    audio: require("../../screen/assets/sons/oceano.mp3"),
    icone: require("../../screen/assets/sons/oceano.png"),
    credito: "Jarrod Stanley · CC0",
  },
  {
    id: "lareira",
    nome: "Lareira",
    descricao: "Madeira queimando e estalando devagar.",
    audio: require("../../screen/assets/sons/lareira.mp3"),
    icone: require("../../screen/assets/sons/lareira.png"),
    credito: "Glaneur de sons · CC BY 3.0",
  },
  {
    id: "passaros",
    nome: "Pássaros",
    descricao: "Pássaros cantando na natureza.",
    audio: require("../../screen/assets/sons/passaros.mp3"),
    icone: require("../../screen/assets/sons/passaros.png"),
    credito: "Matutinho · CC BY-SA 4.0",
  },
  {
    id: "rio",
    nome: "Rios",
    descricao: "Água corrente de um rio.",
    audio: require("../../screen/assets/sons/rio.mp3"),
    icone: require("../../screen/assets/sons/rio.png"),
    credito: "jackthemurray · CC0",
  },
];

// Volume em 5 níveis (0,2 a 1,0). Começa no meio, confortável para ouvir de fundo.
export const NIVEIS_VOLUME = 5;
export const VOLUME_INICIAL = 3;
export const nivelParaVolume = (nivel) => nivel / NIVEIS_VOLUME;
