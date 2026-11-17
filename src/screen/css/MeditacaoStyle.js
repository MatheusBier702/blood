import { StyleSheet } from "react-native";
import color from "../Colors/cor";
import base from "./AlergiasStyle";

// Mesma base visual das abas Alergias, Glicemia e Pressão (títulos, cartões
// brancos com borda suave e sombra, chips, avisos e botões verdes).
// Aqui ficam só os detalhes dos blocos de Sons Naturais.
export const styles = StyleSheet.create({
  ...base,

  // Grade de blocos: 2 por linha em telas largas, 1 por linha no celular estreito.
  sons: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 16 },
  som: {
    flexGrow: 1,
    flexBasis: "45%",
    minWidth: 150,
    padding: 16,
    backgroundColor: color.branco,
    borderWidth: 1,
    borderColor: color.borda,
    borderRadius: 20,
    boxShadow: "0px 6px 16px rgba(31, 61, 43, 0.10)",
  },
  somAtivo: { borderColor: color.colorModelFour, borderWidth: 2, padding: 15 },
  somTopo: { flexDirection: "row", alignItems: "center", gap: 12 },
  somIcone: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: color.fundo,
    alignItems: "center",
    justifyContent: "center",
  },
  somIconeAtivo: { backgroundColor: color.colorModelFive },
  somImagem: { width: 40, height: 40 },
  somNome: { color: color.colorModelFour, fontSize: 16, fontWeight: "700" },
  somDescricao: { color: color.textoSuave, fontSize: 12, lineHeight: 18, marginTop: 10, minHeight: 36 },

  // Botão redondo de tocar/pausar com os símbolos desenhados em View (como a seta do Header).
  somControles: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 12 },
  botaoTocar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: color.colorModelFour,
    alignItems: "center",
    justifyContent: "center",
  },
  triangulo: {
    width: 0,
    height: 0,
    marginLeft: 4,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 13,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: color.branco,
  },
  pausa: { flexDirection: "row", gap: 4 },
  pausaBarra: { width: 4, height: 15, borderRadius: 2, backgroundColor: color.branco },
  somEstado: { flex: 1, minWidth: 0 },
  somEstadoTexto: { color: color.textoSuave, fontSize: 12, fontWeight: "700" },
  somEstadoTextoAtivo: { color: color.colorModelFour },

  // Indicador "tocando": barrinhas que sobem e descem.
  equalizador: { flexDirection: "row", alignItems: "flex-end", gap: 3, height: 16, marginTop: 4 },
  equalizadorBarra: { width: 4, height: 16, borderRadius: 2, backgroundColor: color.colorModelFour },

  // Volume em níveis.
  volume: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 14 },
  volumeBotao: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.borda,
    backgroundColor: color.branco,
    alignItems: "center",
    justifyContent: "center",
  },
  volumeBotaoTexto: { color: color.colorModelFour, fontSize: 16, fontWeight: "800", lineHeight: 18 },
  volumeNiveis: { flex: 1, flexDirection: "row", alignItems: "flex-end", gap: 4, height: 22 },
  volumeNivel: { flex: 1, borderRadius: 3, backgroundColor: color.borda },
  volumeNivelAtivo: { backgroundColor: color.colorModelFour },

  creditoSom: { color: color.textoSuave, fontSize: 10, marginTop: 10 },
});

export default styles;
