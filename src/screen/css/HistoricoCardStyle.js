import { StyleSheet } from "react-native";
import color from "../Colors/cor";

export const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 172,
    borderRadius: 26,
    backgroundColor: color.colorModelTwo,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 20,
    overflow: "hidden",
  },

  // Selo no canto superior esquerdo (gotinha)
  selo: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 42,
    height: 42,
    borderBottomRightRadius: 20,
    backgroundColor: color.fundo,
    alignItems: "center",
    justifyContent: "center",
  },

  seloGota: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderTopLeftRadius: 0,
    backgroundColor: color.colorModelThree,
    transform: [{ rotate: "45deg" }],
  },

  copoImagem: {
    width: 62,
    height: 62,
    resizeMode: "contain",
    marginBottom: 22,
  },

  quantidade: {
    fontSize: 22,
    fontWeight: "500",
    color: color.colorModelOne,
  },
});

export default styles;
