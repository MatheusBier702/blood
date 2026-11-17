import { StyleSheet } from "react-native";
import color from "../Colors/cor";
import base from "./AlergiasStyle";

// Mesma base visual das abas Alergias, Glicemia e Pressão (títulos, cartões,
// chips, filtros, formulários, botões e modais). Aqui ficam só os detalhes da
// caderneta de vacinação.
export const styles = StyleSheet.create({
  ...base,

  // Cartão do paciente
  perfil: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: color.branco,
    borderWidth: 1,
    borderColor: color.borda,
    borderRadius: 20,
    marginTop: 18,
  },
  perfilIcone: { width: 48, height: 48 },
  perfilCorpo: { flex: 1, minWidth: 0 },

  // Resumo com 4 situações (2 por linha no celular)
  resumoSituacoes: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
  resumoSituacao: {
    flexGrow: 1,
    flexBasis: "45%",
    padding: 14,
    borderRadius: 18,
  },
  resumoSituacaoValor: { fontSize: 26, fontWeight: "800" },
  resumoSituacaoRotulo: { fontSize: 12, fontWeight: "700", marginTop: 2 },

  // Linha do tempo das doses (detalhe)
  doses: { marginTop: 4 },
  dose: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: color.borda,
  },
  doseUltima: { borderBottomWidth: 0 },
  dosePonto: { width: 12, height: 12, borderRadius: 6 },
  doseCorpo: { flex: 1, minWidth: 0 },
  doseNome: { color: color.colorModelFour, fontSize: 14, fontWeight: "700" },

  especial: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: color.colorModelTwo,
    marginTop: 10,
  },
  especialTexto: { color: color.colorModelOne, fontSize: 13, lineHeight: 19, fontWeight: "600" },
});

export default styles;
