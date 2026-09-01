import { StyleSheet } from "react-native";
import color from "../Colors/cor";

export const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  // ---------- Número grande (quantidade bebida hoje) ----------
  totalArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: 18,
  },

  totalValor: {
    fontSize: 88,
    fontWeight: "300",
    lineHeight: 96,
    letterSpacing: -2,
    color: color.colorModelOne,
  },

  totalUnidade: {
    fontSize: 26,
    fontWeight: "400",
    color: color.colorModelOne,
    marginLeft: 4,
    marginBottom: 14,
  },

  // ---------- Linha com os dois cards (Objetivo / Próximo lembrete) ----------
  cardsLinha: {
    flexDirection: "row",
    gap: 12,
  },

  card: {
    flex: 1,
    backgroundColor: color.branco,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: color.borda,
    paddingVertical: 14,
    paddingHorizontal: 14,
    boxShadow: "0px 4px 12px rgba(31, 61, 43, 0.08)",
  },

  cardCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  // Barrinha colorida ao lado do título do card
  cardBarra: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },

  cardBarraObjetivo: {
    backgroundColor: color.colorModelFour,
  },

  cardBarraLembrete: {
    backgroundColor: color.colorModelThree,
  },

  cardTitulo: {
    fontSize: 13,
    color: color.textoSuave,
  },

  cardValorLinha: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  cardValor: {
    fontSize: 18,
    fontWeight: "700",
    color: color.colorModelOne,
  },

  cardValorSecundario: {
    fontSize: 13,
    fontWeight: "600",
    color: color.colorModelOne,
    marginLeft: 6,
  },

  // Botão de editar o objetivo (lápis)
  botaoEditar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: color.colorModelTwo,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  botaoEditarGlifo: {
    fontSize: 13,
    color: color.colorModelOne,
  },
});

export default styles;
