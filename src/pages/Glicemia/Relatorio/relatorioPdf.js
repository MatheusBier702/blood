import { Platform } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import color from "../../../screen/Colors/cor";
import {
  MOMENTOS_COM_META,
  descreverMeta,
  formatarData,
  formatarDataHora,
  rotuloMomento,
} from "../dadosGlicemia";

const escapar = (texto) =>
  String(texto ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const arred = (n) => (n == null ? "—" : Math.round(n));

// Gráfico simples em SVG (texto), para caber no PDF.
function graficoSvg(lista, inicio, fim) {
  if (lista.length < 2) return "";
  const L = 680, A = 200, m = { e: 40, d: 10, t: 10, b: 24 };
  const valores = lista.map((x) => x.valor);
  const min = Math.max(0, Math.floor((Math.min(...valores) - 10) / 20) * 20);
  const max = Math.ceil((Math.max(...valores) + 10) / 20) * 20;
  const x = (t) => m.e + ((t - inicio) / (fim - inicio)) * (L - m.e - m.d);
  const y = (v) => m.t + (A - m.t - m.b) * (1 - (v - min) / (max - min));
  const grade = [];
  for (let i = 0; i <= 4; i += 1) {
    const v = min + ((max - min) * i) / 4;
    grade.push(
      `<line x1="${m.e}" x2="${L - m.d}" y1="${y(v)}" y2="${y(v)}" stroke="${color.borda}"/>` +
        `<text x="${m.e - 6}" y="${y(v) + 4}" font-size="10" text-anchor="end" fill="${color.textoSuave}">${Math.round(v)}</text>`
    );
  }
  const caminho = lista.map((p, i) => `${i ? "L" : "M"}${x(p.quando).toFixed(1)},${y(p.valor).toFixed(1)}`).join(" ");
  const pontos = lista.map((p) => `<circle cx="${x(p.quando)}" cy="${y(p.valor)}" r="2.5" fill="${color.colorModelOne}"/>`).join("");
  return `<svg width="${L}" height="${A}" viewBox="0 0 ${L} ${A}" style="max-width:100%;height:auto" xmlns="http://www.w3.org/2000/svg">
    ${grade.join("")}
    <path d="${caminho}" stroke="${color.colorModelThree}" stroke-width="2" fill="none"/>
    ${pontos}
    <text x="${m.e}" y="${A - 6}" font-size="10" fill="${color.textoSuave}">${escapar(formatarData(isoDe(new Date(inicio))))}</text>
    <text x="${L - m.d}" y="${A - 6}" font-size="10" text-anchor="end" fill="${color.textoSuave}">${escapar(formatarData(isoDe(new Date(fim))))}</text>
  </svg>`;
}

const dois = (n) => String(n).padStart(2, "0");
const isoDe = (d) => `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;

export function montarHtmlRelatorio({ nome, periodo, inicio, fim, resumo, porMomento, semanas, medicoes, metas }) {
  const linhasMomento = porMomento
    .map(
      (m) => `<tr><td>${escapar(m.rotulo)}</td><td>${m.quantidade}</td><td>${arred(m.media)}</td>
        <td>${m.menor?.valor ?? "—"}</td><td>${m.maior?.valor ?? "—"}</td>
        <td>${m.dentroDaMeta != null ? `${m.dentroDaMeta}%` : "—"}</td></tr>`
    )
    .join("");
  const linhasSemana = semanas
    .map(
      (s) => `<tr><td>${formatarData(s.de)} a ${formatarData(s.ate)}</td><td>${s.quantidade}</td><td>${arred(s.media)}</td>
        <td>${s.menor?.valor ?? "—"}</td><td>${s.maior?.valor ?? "—"}</td></tr>`
    )
    .join("");
  const linhasMetas = MOMENTOS_COM_META.map(
    (m) => `<tr><td>${escapar(m.rotulo)}</td><td>${escapar(descreverMeta(metas[m.valor]))}</td></tr>`
  ).join("");
  const linhasMedicoes = [...medicoes]
    .reverse()
    .map(
      (x) => `<tr><td>${escapar(formatarDataHora(x))}</td><td>${x.valor}</td><td>${escapar(rotuloMomento(x.momento))}</td>
        <td>${escapar(x.observacoes || "")}</td></tr>`
    )
    .join("");

  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"/>
<title>Relatório de glicemia</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #24342a; margin: 28px; }
  h1 { color: ${color.colorModelFour}; font-size: 24px; margin: 0; }
  h2 { color: ${color.colorModelFour}; font-size: 16px; margin: 24px 0 8px; }
  .sub { color: ${color.textoSuave}; font-size: 12px; margin-top: 4px; }
  .cards { display: flex; gap: 10px; margin-top: 16px; }
  .card { flex: 1; border: 1px solid ${color.borda}; border-radius: 12px; padding: 10px 12px; }
  .valor { font-size: 22px; font-weight: 800; color: ${color.colorModelFour}; }
  .rot { font-size: 11px; color: ${color.textoSuave}; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { text-align: left; background: ${color.fundo}; color: ${color.textoSuave}; font-weight: 700; }
  th, td { padding: 6px 8px; border-bottom: 1px solid ${color.borda}; vertical-align: top; }
  .nota { font-size: 11px; color: ${color.textoSuave}; margin-top: 20px; }
  @page { margin: 16mm; }
</style></head><body>
  <h1>Relatório de glicemia</h1>
  <div class="sub">${nome ? `${escapar(nome)} · ` : ""}Últimos ${periodo} dias (${formatarData(isoDe(inicio))} a ${formatarData(isoDe(fim))}) · gerado em ${formatarData(isoDe(new Date()))}</div>
  <div class="cards">
    <div class="card"><div class="valor">${arred(resumo.media)}</div><div class="rot">média (mg/dL)</div></div>
    <div class="card"><div class="valor">${resumo.menor?.valor ?? "—"}</div><div class="rot">menor${resumo.menor ? ` · ${escapar(formatarDataHora(resumo.menor))}` : ""}</div></div>
    <div class="card"><div class="valor">${resumo.maior?.valor ?? "—"}</div><div class="rot">maior${resumo.maior ? ` · ${escapar(formatarDataHora(resumo.maior))}` : ""}</div></div>
    <div class="card"><div class="valor">${resumo.quantidade}</div><div class="rot">medições</div></div>
  </div>
  <h2>Evolução</h2>
  ${graficoSvg(medicoes.map((m) => ({ valor: m.valor, quando: m.quando })), inicio.getTime(), fim.getTime())}
  <table><tr><th>Semana</th><th>Medições</th><th>Média</th><th>Menor</th><th>Maior</th></tr>${linhasSemana}</table>
  <h2>Por momento da medição</h2>
  <table><tr><th>Momento</th><th>Medições</th><th>Média</th><th>Menor</th><th>Maior</th><th>Dentro da meta</th></tr>${linhasMomento}</table>
  <h2>Metas individuais</h2>
  <table><tr><th>Momento</th><th>Meta</th></tr>${linhasMetas}</table>
  <h2>Medições do período</h2>
  <table><tr><th>Data e horário</th><th>mg/dL</th><th>Momento</th><th>Observações</th></tr>${linhasMedicoes}</table>
  <p class="nota">Relatório gerado pelo app Blood a partir dos registros do próprio paciente. "Dentro da meta" usa as metas que o paciente cadastrou. Este documento não substitui avaliação médica.</p>
</body></html>`;
}

// Gera e entrega o PDF: no celular cria o arquivo e abre o compartilhamento;
// na web abre o relatório em uma nova aba com a janela de impressão
// (onde é possível escolher "Salvar como PDF").
export async function exportarRelatorioPdf(html) {
  if (Platform.OS === "web") {
    const janela = window.open("", "_blank");
    if (!janela) throw new Error("O navegador bloqueou a nova janela. Permita pop-ups para exportar.");
    janela.document.open();
    janela.document.write(html);
    janela.document.close();
    janela.focus();
    setTimeout(() => janela.print(), 300);
    return "web";
  }
  const { uri } = await Print.printToFileAsync({ html });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType: "application/pdf", UTI: ".pdf", dialogTitle: "Relatório de glicemia" });
  }
  return uri;
}
