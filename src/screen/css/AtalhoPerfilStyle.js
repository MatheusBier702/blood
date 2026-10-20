import { StyleSheet } from "react-native";
import color from "../Colors/cor";

export const styles = StyleSheet.create({
  atalho: {
    alignItems: "center",
    padding: 8,
    gap: 2,
    minWidth: 64,
    minHeight: 56,
  },
  icone: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  cabeca: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: color.branco,
  },
  corpo: {
    width: 27,
    height: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderWidth: 2,
    borderColor: color.branco,
  },
  texto: { color: color.branco, fontSize: 11, fontWeight: "600" },
  pressionado: { opacity: 0.6 },
});
