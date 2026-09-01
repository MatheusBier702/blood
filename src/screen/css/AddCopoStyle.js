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
});

export default styles;
