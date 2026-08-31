import { StyleSheet, Platform, StatusBar } from "react-native";
import color from "../Colors/cor";

const ALTURA_STATUS = Platform.select({
  android: StatusBar.currentHeight || 24,
  ios: 44,
  default: 0,
});

export const styles = StyleSheet.create({
  container: {
    backgroundColor: color.colorModelFour,
    paddingTop: ALTURA_STATUS,
    boxShadow: "0px 2px 8px rgba(31, 61, 43, 0.25)",
  },

  barra: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  // O título ocupa a barra inteira em posição absoluta, por isso fica
  // centralizado de verdade, sem depender da largura do que está nas laterais.
  // O padding lateral impede que um título longo passe por baixo dos ícones.
  tituloArea: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 112,
  },

  titulo: {
    color: color.branco,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  acoes: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ---------- Botão voltar ----------
  botaoVoltar: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 6,
  },

  // A seta é desenhada com uma linha e uma ponta em formato de "V"
  seta: {
    width: 20,
    height: 16,
    marginRight: 6,
  },

  setaLinha: {
    position: "absolute",
    left: 2,
    top: 7,
    width: 16,
    height: 2,
    borderRadius: 2,
    backgroundColor: color.branco,
  },

  setaPonta: {
    position: "absolute",
    left: 2,
    top: 3,
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: color.branco,
    transform: [{ rotate: "45deg" }],
  },

  voltarTexto: {
    color: color.branco,
    fontSize: 15,
    fontWeight: "600",
  },

  botao: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  // Ícone de menu (três barras)
  menu: {
    width: 20,
    height: 14,
    justifyContent: "space-between",
  },

  menuBarra: {
    height: 2,
    borderRadius: 2,
    backgroundColor: color.branco,
  },

  // Coração e demais glifos
  glifo: {
    color: color.branco,
    fontSize: 20,
    lineHeight: 22,
  },

  // Ícone de busca (círculo + cabo)
  lupa: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: color.branco,
  },

  lupaCabo: {
    position: "absolute",
    width: 2,
    height: 7,
    right: 11,
    bottom: 9,
    borderRadius: 2,
    backgroundColor: color.branco,
    transform: [{ rotate: "-45deg" }],
  },

  // Menu de opções (três pontos)
  pontos: {
    height: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },

  ponto: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.branco,
  },

  // Faixa verde abaixo da barra, como no modelo
  faixa: {
    height: 18,
    backgroundColor: color.colorModelFour,
  },
});
