import { StyleSheet, Dimensions } from "react-native";
import color from "../Colors/cor";

const LARGURA = Dimensions.get("window").width;

// Espaço reservado acima da água para a curva aparecer
export const ALTURA_CRISTA = 44;


export const DIAMETRO = LARGURA;

export const styles = StyleSheet.create({
  // Ocupa a parte de baixo da tela; a altura é controlada pelo componente
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },

  // Corpo da "água" (bloco sólido abaixo da curva)
  agua: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: ALTURA_CRISTA,
    backgroundColor: color.colorModelThree,
  },

  // Curva da frente (mesma cor da água)
  curva: {
    position: "absolute",
    left: 0,
    top: ALTURA_CRISTA - 30, // quanto a crista sobe acima da água
    width: DIAMETRO,
    height: DIAMETRO,
    borderRadius: DIAMETRO / 2,
    backgroundColor: color.colorModelThree,
  },

  // Curva de trás, mais clara, para dar profundidade
  curvaFundo: {
    top: ALTURA_CRISTA - 40,
    backgroundColor: color.colorModelTwo,
    opacity: 0.8,
  },

  // ---------- Etiqueta "24%" ----------
  etiqueta: {
    position: "absolute",
    left: 0,
    top: ALTURA_CRISTA + 14,
    flexDirection: "row",
    alignItems: "center",
  },

  etiquetaCaixa: {
    backgroundColor: color.branco,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },

  etiquetaTexto: {
    fontSize: 22,
    fontWeight: "600",
    color: color.colorModelOne,
  },

  // Pontinha branca à direita (triângulo feito com bordas)
  etiquetaPonta: {
    width: 0,
    height: 0,
    borderTopWidth: 20,
    borderBottomWidth: 20,
    borderLeftWidth: 12,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: color.branco,
  },
});

export default styles;
