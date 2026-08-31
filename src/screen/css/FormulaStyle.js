import { StyleSheet } from "react-native";
import color from "../Colors/cor";

// Escala de vermelhos para as faixas de sobrepeso/obesidade.
// O primeiro tom é o mesmo usado na barra do resultado (ImcStyle),
// e os demais vão escurecendo conforme a gravidade da faixa.
export const faixaCores = {
  abaixo: { forte: color.colorModelThree, fundo: "#E8F2FB" },
  adequado: { forte: color.colorModelFour, fundo: "#E6F2E9" },
  sobrepeso: { forte: "#D97F7F", fundo: "#FAEDED" },
  obesidadeUm: { forte: "#C56767", fundo: "#F7E5E5" },
  obesidadeDois: { forte: "#AE5050", fundo: "#F3DCDC" },
  obesidadeTres: { forte: "#8F3D3D", fundo: "#EED2D2" },
};

export const styles = StyleSheet.create({
  // ---------- Introdução ----------
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  cabecalhoIcone: {
    width: 30,
    height: 30,
    marginRight: 10,
    resizeMode: "contain",
  },

  titulo: {
    fontSize: 18,
    fontWeight: "700",
    color: color.colorModelFour,
    letterSpacing: -0.2,
  },

  texto: {
    fontSize: 13,
    lineHeight: 20,
    color: color.textoSuave,
  },

  textoDestaque: {
    color: color.colorModelOne,
    fontWeight: "700",
  },

  // ---------- Fórmula em destaque ----------
  formulaCaixa: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.fundo,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: color.borda,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 18,
  },

  formulaSigla: {
    fontSize: 22,
    fontWeight: "800",
    color: color.colorModelFour,
    letterSpacing: -0.4,
  },

  formulaIgual: {
    fontSize: 18,
    fontWeight: "600",
    color: color.textoSuave,
    marginHorizontal: 12,
  },

  // A fração é montada com dois textos e uma linha no meio
  fracao: {
    alignItems: "center",
  },

  fracaoTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: color.colorModelOne,
  },

  fracaoLinha: {
    height: 2,
    borderRadius: 1,
    alignSelf: "stretch",
    backgroundColor: color.colorModelThree,
    marginVertical: 7,
  },

  exemplo: {
    fontSize: 12,
    lineHeight: 18,
    color: color.textoSuave,
    textAlign: "center",
    marginTop: 12,
  },

  exemploValor: {
    color: color.colorModelFour,
    fontWeight: "700",
  },

  // ---------- Tabela de classificação ----------
  tabelaTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: color.colorModelFour,
    marginTop: 26,
    marginBottom: 12,
  },

  linha: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 11,
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 8,
  },

  linhaMarca: {
    width: 4,
    height: 26,
    borderRadius: 2,
    marginRight: 12,
  },

  linhaValor: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },

  linhaSelo: {
    // backgroundColor: color.branco,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  linhaSeloTexto: {
    fontSize: 12,
    fontWeight: "700",
  },

  // ---------- Observação final ----------
  nota: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: color.colorModelTwo,
    borderRadius: 16,
    padding: 14,
    marginTop: 18,
  },

  notaIcone: {
    width: 22,
    height: 22,
    marginRight: 10,
    marginTop: 1,
    resizeMode: "contain",
  },

  notaTexto: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: color.colorModelOne,
  },
});

export default styles;
