import { StyleSheet } from "react-native";
import color from "../Colors/cor";
import base from "./AlergiasStyle";

// A aba Glicemia usa a mesma base visual da aba Alergias (títulos, cartões,
// filtros, formulários, botões e modais) e acrescenta só o que é dela:
// o destaque da última medição e o gráfico.
export const styles = StyleSheet.create({
  ...base,

  // ---------- Última medição ----------
  ultima: {
    padding: 20,
    backgroundColor: color.colorModelOne,
    borderRadius: 24,
    marginTop: 18,
  },
  ultimaRotulo: { color: color.colorModelTwo, fontSize: 12, fontWeight: "800", letterSpacing: 1.4 },
  ultimaValorLinha: { flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 6 },
  ultimaValor: { color: color.branco, fontSize: 44, fontWeight: "800", letterSpacing: -1 },
  ultimaUnidade: { color: color.colorModelTwo, fontSize: 16, fontWeight: "700" },
  ultimaTexto: { color: color.colorModelTwo, fontSize: 13, lineHeight: 19, marginTop: 2 },
  ultimaChips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  ultimaChip: {
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ultimaChipTexto: { color: color.branco, fontSize: 12, fontWeight: "600" },

  // ---------- Valor nas listas ----------
  valorCaixa: {
    minWidth: 58,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: color.colorModelTwo,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  valorNumero: { color: color.colorModelOne, fontSize: 20, fontWeight: "800" },
  valorUnidade: { color: color.colorModelOne, fontSize: 10, fontWeight: "700" },
  grupoData: { color: color.textoSuave, fontSize: 12, fontWeight: "800", letterSpacing: 1.2, marginTop: 14, marginBottom: 8 },

  // ---------- Gráfico ----------
  grafico: {
    padding: 14,
    paddingBottom: 10,
    backgroundColor: color.branco,
    borderWidth: 1,
    borderColor: color.borda,
    borderRadius: 24,
    marginTop: 14,
  },
  graficoVazio: { height: 180, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 },
  dica: {
    position: "absolute",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: color.colorModelFour,
    boxShadow: "0px 4px 12px rgba(31, 61, 43, 0.25)",
  },
  dicaValor: { color: color.branco, fontSize: 15, fontWeight: "800" },
  dicaTexto: { color: color.colorModelFive, fontSize: 11, lineHeight: 15 },
  legendaGrafico: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 },
  legendaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendaCor: { width: 10, height: 10, borderRadius: 5 },

  // ---------- Relatório ----------
  tabela: {
    backgroundColor: color.branco,
    borderWidth: 1,
    borderColor: color.borda,
    borderRadius: 20,
    overflow: "hidden",
  },
  tabelaLinha: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: color.borda,
  },
  tabelaCabecalho: { backgroundColor: color.fundo, borderTopWidth: 0 },
  tabelaCelula: { flex: 1, color: color.colorModelFour, fontSize: 13 },
  tabelaCelulaTitulo: { color: color.textoSuave, fontSize: 12, fontWeight: "700" },
  tabelaCelulaDireita: { textAlign: "right" },

  // ---------- Metas ----------
  metaValor: { color: color.colorModelFour, fontSize: 18, fontWeight: "800", marginTop: 4 },
  metaVazia: { color: color.textoSuave, fontSize: 14, fontWeight: "600", marginTop: 4 },
});

export default styles;
