import { StyleSheet } from "react-native";
import color from "../Colors/cor";
import base from "./GlicemiaStyle";

// Mesma base visual das abas Alergias e Glicemia (títulos, cartões, filtros,
// formulários, botões, modais, destaque da última medição e gráfico).
// Aqui ficam só os detalhes próprios da pressão arterial.
export const CORES_PRESSAO = {
  sistolica: color.colorModelOne,
  diastolica: color.colorModelFour,
};

export const styles = StyleSheet.create({
  ...base,

  // Caixa do valor nas listas: "128/82" é mais largo que um valor de glicemia.
  valorCaixaPressao: { minWidth: 76 },
  valorPressao: { color: color.colorModelOne, fontSize: 17, fontWeight: "800" },

  // Legenda das duas linhas do gráfico.
  legendaLinha: { width: 16, height: 3, borderRadius: 2 },
  legendaTexto: { color: color.textoSuave, fontSize: 12, fontWeight: "600" },

  // Cartão de alerta.
  alerta: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
  },
  alertaTitulo: { fontSize: 15, fontWeight: "800" },
  alertaValor: { fontSize: 22, fontWeight: "800", marginTop: 4 },
  alertaTexto: { fontSize: 13, lineHeight: 19, marginTop: 6 },
  alertaVisto: { opacity: 0.65 },

  // Faixa de emergência (orientação de segurança).
  emergencia: {
    padding: 18,
    backgroundColor: color.vermelho,
    borderRadius: 20,
    marginTop: 18,
  },
  emergenciaTitulo: { color: color.branco, fontSize: 16, fontWeight: "800" },
  emergenciaTexto: { color: color.branco, fontSize: 13, lineHeight: 19, marginTop: 6 },
  emergenciaBotao: {
    alignSelf: "flex-start",
    backgroundColor: color.branco,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 12,
  },
  emergenciaBotaoTexto: { color: color.vermelho, fontSize: 13, fontWeight: "800" },
});

export default styles;
