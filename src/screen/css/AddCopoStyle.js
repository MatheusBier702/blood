import { StyleSheet } from "react-native";
import color from "../Colors/cor";

export const styles = StyleSheet.create({
  botao: {
    alignSelf: "center",
    width: "58%",
    height: 64,
    borderRadius: 32,
    backgroundColor: color.branco,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 6px 16px rgba(18, 98, 140, 0.25)",
  },

  botaoPressionado: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  mais: {
    fontSize: 30,
    fontWeight: "300",
    color: color.colorModelOne,
    marginRight: 10,
    lineHeight: 34,
  },

  texto: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
    color: color.colorModelOne,
  },

  // =========================
  // MODAL
  // =========================

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  modal: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: color.branco,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",

    boxShadow: "0px 8px 24px rgba(18, 98, 140, 0.25)",
  },

  modalTitulo: {
    fontSize: 22,
    fontWeight: "800",
    color: color.colorModelOne,
    marginBottom: 20,
  },

  opcao: {
    width: "100%",
    height: 54,
    borderRadius: 14,
    backgroundColor: "#EAF7FC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  opcaoTexto: {
    fontSize: 18,
    fontWeight: "700",
    color: color.colorModelOne,
  },

  cancelar: {
    marginTop: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  cancelarTexto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#777",
  },
});

export default styles;
