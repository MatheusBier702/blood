import { Linking } from "react-native";

export const formatarDistancia = (km) =>
  km == null ? "" : km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace(".", ",")} km`;

export const formatarTempo = (min) => {
  if (min == null) return "";
  if (min < 1) return "menos de 1 min";
  if (min < 60) return `${min} min`;
  const horas = Math.floor(min / 60);
  const resto = min % 60;
  return resto ? `${horas} h ${resto} min` : `${horas} h`;
};

export const abrirNoAppDeMapas = (unidade, modo) => {
  const destino = `${unidade.lat},${unidade.lon}`;
  const viagem = modo === "carro" ? "driving" : "walking";
  Linking.openURL(
    `https://www.google.com/maps/dir/?api=1&destination=${destino}&travelmode=${viagem}`
  ).catch(() => {});
};

export const ligar = (telefone) => {
  const numero = String(telefone || "").split(/[-/]/)[0].replace(/\D/g, "");
  if (numero) Linking.openURL(`tel:${numero}`).catch(() => {});
};
