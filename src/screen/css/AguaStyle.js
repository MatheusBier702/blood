import { StyleSheet } from "react-native";
import color from "../Colors/cor";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.fundo,
  },

  // Área abaixo do Header. A Onda fica em posição absoluta dentro dela,
  // por isso precisa de position "relative" e flex 1 para ocupar a tela toda.
  conteudo: {
    flex: 1,
    position: "relative",
    justifyContent: "space-between",
  },

  // Parte de baixo (cards + botão beber), desenhada por cima da onda.
  rodape: {
    paddingBottom: 28,
  },

  // Lista horizontal de copos
  listaCopos: {
    paddingHorizontal: 16,
    gap: 14,
    paddingBottom: 26,
  },
});

export default styles;
