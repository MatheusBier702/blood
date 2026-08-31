import { StyleSheet } from "react-native";
import color from "../Colors/cor";

// Tom extra usado apenas para a faixa "Sobrepeso" do medidor.
// Não existe vermelho na paleta oficial (cor.js), então foi escolhido
// um tom que conversa com os tons de apoio (neutros/suaves) já usados.
const vermelho = "#D97F7F";
const vermelhoClaro = "#F7E3E3";
const vermelhoEscuro = "#B05A5A";

export const styles = StyleSheet.create({
  // ---------- Base da tela ----------
  container: {
    flex: 1,
    backgroundColor: color.fundo,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },

  cabecalhoTexto: {
    marginBottom: 20,
  },

  titulo: {
    color: color.colorModelFour,
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  subtitulo: {
    color: color.textoSuave,
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },

  // ---------- Cartão (mesmo padrão dos Cards da Home) ----------
  cartao: {
    backgroundColor: color.branco,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: color.borda,
    padding: 22,
    boxShadow: "0px 6px 16px rgba(31, 61, 43, 0.10)",
  },

  cartaoEspaco: {
    marginBottom: 20,
  },

  // ---------- Alternador Métrico / Fórmula ----------
  alternador: {
    flexDirection: "row",
    backgroundColor: color.fundo,
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },

  alternadorBotao: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
  },

  alternadorBotaoAtivo: {
    backgroundColor: color.branco,
    boxShadow: "0px 2px 6px rgba(31, 61, 43, 0.12)",
  },

  alternadorGlifo: {
    fontSize: 14,
    marginRight: 6,
  },

  alternadorIconeImagem: {
    width: 26,
    height: 26,
    marginRight: 6,
    resizeMode: "contain",
  },

  alternadorTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: color.textoSuave,
  },

  alternadorTextoAtivo: {
    color: color.colorModelOne,
  },

  // ---------- Linhas de campo (Altura / Peso) ----------
  campo: {
    marginBottom: 22,
  },

  campoCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  campoLabelArea: {
    flexDirection: "row",
    alignItems: "center",
  },

  campoIconeCirculo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.colorModelTwo,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  campoIconeGlifo: {
    fontSize: 15,
  },

  campoIconeImagem: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },

  campoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: color.colorModelOne,
  },

  campoValor: {
    fontSize: 16,
    fontWeight: "700",
    color: color.colorModelFour,
  },

  // Input normal (substitui a antiga barra estilo "slider")
  inputNormal: {
    height: 40,
    borderWidth: 1,
    borderColor: color.colorModelTwo,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: "600",
    color: color.colorModelFour,
  },

  // Barra estilo "slider" (apenas visual, sem interação)
  trilha: {
    height: 6,
    borderRadius: 3,
    backgroundColor: color.colorModelTwo,
    justifyContent: "center",
  },

  trilhaPreenchida: {
    height: 6,
    borderRadius: 3,
    backgroundColor: color.colorModelThree,
    position: "absolute",
    left: 0,
    top: 0,
  },

  trilhaBolinha: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: color.branco,
    borderWidth: 3,
    borderColor: color.colorModelThree,
    top: -6,
    boxShadow: "0px 2px 4px rgba(31, 61, 43, 0.20)",
  },

  // ---------- Linha de campo (Idade) com seletor +/- ----------
  seletor: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: color.fundo,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  seletorBotao: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: color.branco,
    borderWidth: 1,
    borderColor: color.borda,
    alignItems: "center",
    justifyContent: "center",
  },

  seletorBotaoTexto: {
    fontSize: 18,
    fontWeight: "700",
    color: color.colorModelOne,
    lineHeight: 20,
  },

  seletorValorArea: {
    alignItems: "center",
  },

  seletorValor: {
    fontSize: 20,
    fontWeight: "700",
    color: color.colorModelFour,
  },

  seletorUnidade: {
    fontSize: 12,
    color: color.textoSuave,
    marginTop: 2,
  },

  // ---------- Botão calcular ----------
  botaoCalcular: {
    backgroundColor: color.colorModelOne,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    boxShadow: "0px 8px 18px rgba(18, 98, 140, 0.30)",
  },

  botaoCalcularTexto: {
    color: color.branco,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  // ---------- Cartão de resultado ----------
  resultadoTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: color.colorModelFour,
    textAlign: "center",
    marginBottom: 18,
  },

  // Medidor (versão sem SVG: barra segmentada representando
  // Abaixo do peso / Saudável / Sobrepeso, como no modelo de referência)
  medidorArea: {
    alignItems: "center",
  },

  // Envolve a barra e a seta: e a referencia para posicionar a seta em %
  medidorTrilha: {
    width: "100%",
  },

  medidorBarra: {
    flexDirection: "row",
    width: "100%",
    height: 14,
    borderRadius: 8,
    overflow: "hidden",
  },

  medidorFaixaAbaixo: {
    flex: 25,
    backgroundColor: color.colorModelThree,
  },

  medidorFaixaSaudavel: {
    flex: 33,
    backgroundColor: color.colorModelFour,
  },

  medidorFaixaSobrepeso: {
    flex: 42,
    backgroundColor: vermelho,
  },

  medidorMarcador: {
    position: "absolute",
    top: -10,
    // metade da largura do triangulo (7 + 7), para a ponta cair no ponto exato
    marginLeft: -7,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: color.colorModelOne,
  },

  medidorLegendas: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },

  medidorLegendaTexto: {
    fontSize: 11,
    color: color.textoSuave,
  },

  medidorEtiquetas: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 14,
  },

  etiqueta: {
    alignItems: "center",
    flex: 1,
  },

  etiquetaBolinha: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },

  etiquetaBolinhaAbaixo: {
    backgroundColor: color.colorModelThree,
  },

  etiquetaBolinhaSaudavel: {
    backgroundColor: color.colorModelFour,
  },

  etiquetaBolinhaSobrepeso: {
    backgroundColor: vermelho,
  },

  etiquetaTexto: {
    fontSize: 11,
    color: color.textoSuave,
    textAlign: "center",
  },

  // Destaque da etiqueta correspondente ao resultado
  etiquetaTextoAtivaAbaixo: {
    color: color.colorModelThree,
    fontWeight: "700",
  },

  etiquetaTextoAtivaSaudavel: {
    color: color.colorModelFour,
    fontWeight: "700",
  },

  etiquetaTextoAtivaSobrepeso: {
    color: vermelhoEscuro,
    fontWeight: "700",
  },

  // Valor final do IMC
  resultadoValorArea: {
    alignItems: "center",
    marginTop: 22,
  },

  resultadoValorLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: color.textoSuave,
    letterSpacing: 1,
    marginBottom: 2,
  },

  resultadoValor: {
    fontSize: 40,
    fontWeight: "800",
    color: color.colorModelFour,
  },

  resultadoSelo: {
    marginTop: 10,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
  },

  resultadoSeloTexto: {
    fontSize: 13,
    fontWeight: "700",
  },

  // ---------- Variacoes de cor por faixa da barra ----------
  valorAbaixo: {
    color: color.colorModelThree,
  },

  valorSaudavel: {
    color: color.colorModelFour,
  },

  valorSobrepeso: {
    color: vermelhoEscuro,
  },

  // Estado antes de calcular (nao corresponde a nenhuma faixa da barra)
  valorSemCalculo: {
    color: color.textoSuave,
  },

  seloAbaixo: {
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderBottomColor: color.colorModelTwo,
    borderTopColor: color.colorModelTwo,
    borderRadius: 1,
  },

  seloTextoAbaixo: {
    color: color.colorModelOne,
  },

  seloSaudavel: {
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderBottomColor: color.colorModelFive,
    borderTopColor: color.colorModelFive,
    borderRadius: 1,
  },

  seloTextoSaudavel: {
    color: color.colorModelFour,
  },

  seloSobrepeso: {
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderBottomColor: vermelhoClaro,
    borderTopColor: vermelhoClaro,
    borderRadius: 1,
  },

  seloTextoSobrepeso: {
    color: vermelhoEscuro,
  },

  seloSemCalculo: {
    backgroundColor: color.fundo,
  },

  seloTextoSemCalculo: {
    color: color.textoSuave,
  },
});

export default styles;
