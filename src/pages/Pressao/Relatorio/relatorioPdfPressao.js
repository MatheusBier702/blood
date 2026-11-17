import color from "../../../screen/Colors/cor";
import { CORES_PRESSAO } from "../../../screen/css/PressaoStyle";
import {
  TIPOS_ALERTA,
  alertaDaMedicao,
  descreverMeta,
  formatarData,
  formatarDataHora,
  isoDe,
  rotuloBraco,
  rotuloContexto,
  temMetas,
} from "../dadosPressao";

// A geração/entrega do PDF é a mesma da aba Glicemia (expo-print + expo-sharing no
// celular; janela de impressão na web).
export { exportarRelatorioPdf } from "../../Glicemia/Relatorio/relatorioPdf";

const escapar = (texto) =>
  String(texto ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const arred = (n) => (n == null ? "—" : Math.round(n));

function graficoSvg(lista, inicio, fim) {
  if (lista.length < 2) return "";
  const L = 680, A = 220, m = { e: 40, d: 10, t: 10, b: 24 };
  const valores = lista.flatMap((p) => [p.sistolica, p.diastolica]);
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
  const caminho = (campo) => lista.map((p, i) => `${i ? "L" : "M"}${x(p.quando).toFixed(1)},${y(p[campo]).toFixed(1)}`).join(" ");
  return `<svg width="${L}" height="${A}" viewBox="0 0 ${L} ${A}" style="max-width:100%;height:auto" xmlns="http://www.w3.org/2000/svg">
    ${grade.join("")}
    <path d="${caminho("sistolica")}" stroke="${CORES_PRESSAO.sistolica}" stroke-width="2" fill="none"/>
    <path d="${caminho("diastolica")}" stroke="${CORES_PRESSAO.diastolica}" stroke-width="2" stroke-dasharray="6 4" fill="none"/>
    <text x="${m.e}" y="${A - 6}" font-size="10" fill="${color.textoSuave}">${formatarData(isoDe(new Date(inicio)))}</text>
    <text x="${L - m.d}" y="${A - 6}" font-size="10" text-anchor="end" fill="${color.textoSuave}">${formatarData(isoDe(new Date(fim)))}</text>
  </svg>
  <div class="legenda"><span style="color:${CORES_PRESSAO.sistolica}">━ Sistólica (máxima)</span>
  <span style="color:${CORES_PRESSAO.diastolica}">┅ Diastólica (mínima)</span></div>`;
}

export function montarHtmlRelatorioPressao({ nome, periodo, inicio, fim, resumo, semanas, porContexto, medicoes, metas }) {
  const cel = (registro, campo) =>
    registro ? `${registro[campo]} <span class="rot">(${escapar(formatarDataHora(registro))})</span>` : "—";
  const linhasSemana = semanas
    .map(
      (s) => `<tr><td>${formatarData(s.de)} a ${formatarData(s.ate)}</td><td>${s.quantidade}</td>
        <td>${s.quantidade ? `${arred(s.sistolica.media)}/${arred(s.diastolica.media)}` : "—"}</td>
        <td>${s.frequencia.quantidade ? arred(s.frequencia.media) : "—"}</td></tr>`
    )
    .join("");
  const linhasContexto = porContexto
    .map(
      (c) => `<tr><td>${escapar(c.rotulo)}</td><td>${c.quantidade}</td>
        <td>${arred(c.sistolica.media)}/${arred(c.diastolica.media)}</td></tr>`
    )
    .join("");
  const linhasMedicoes = [...medicoes]
    .reverse()
    .map((x) => {
      const alerta = alertaDaMedicao(x, metas);
      return `<tr><td>${escapar(formatarDataHora(x))}</td><td><b>${x.sistolica}/${x.diastolica}</b></td>
        <td>${x.frequencia ?? "—"}</td><td>${escapar(rotuloContexto(x.contexto))}</td><td>${escapar(rotuloBraco(x.braco))}</td>
        <td>${alerta ? escapar(TIPOS_ALERTA[alerta].rotulo) : ""}</td><td>${escapar(x.observacoes || "")}</td></tr>`;
    })
    .join("");

  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"/>
<title>Relatório de pressão arterial</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #24342a; margin: 28px; }
  h1 { color: ${color.colorModelFour}; font-size: 24px; margin: 0; }
  h2 { color: ${color.colorModelFour}; font-size: 16px; margin: 24px 0 8px; }
  .sub, .rot { color: ${color.textoSuave}; font-size: 11px; }
  .cards { display: flex; gap: 10px; margin-top: 16px; }
  .card { flex: 1; border: 1px solid ${color.borda}; border-radius: 12px; padding: 10px 12px; }
  .valor { font-size: 22px; font-weight: 800; color: ${color.colorModelFour}; }
  .legenda { font-size: 11px; display: flex; gap: 16px; margin: 4px 0 10px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { text-align: left; background: ${color.fundo}; color: ${color.textoSuave}; font-weight: 700; }
  th, td { padding: 6px 8px; border-bottom: 1px solid ${color.borda}; vertical-align: top; }
  .nota { font-size: 11px; color: ${color.textoSuave}; margin-top: 20px; }
  @page { margin: 16mm; }
</style></head><body>
  <h1>Relatório de pressão arterial</h1>
  <div class="sub">${nome ? `${escapar(nome)} · ` : ""}Últimos ${periodo} dias (${formatarData(isoDe(inicio))} a ${formatarData(isoDe(fim))}) · gerado em ${formatarData(isoDe(new Date()))}</div>
  <div class="cards">
    <div class="card"><div class="valor">${resumo.quantidade >= 2 ? `${arred(resumo.sistolica.media)}/${arred(resumo.diastolica.media)}` : "—"}</div><div class="rot">média (mmHg)</div></div>
    <div class="card"><div class="valor">${resumo.quantidade}</div><div class="rot">medições</div></div>
    <div class="card"><div class="valor">${resumo.frequencia.quantidade ? arred(resumo.frequencia.media) : "—"}</div><div class="rot">FC média (bpm) · ${resumo.frequencia.quantidade} com FC</div></div>
  </div>
  <h2>Maiores e menores valores</h2>
  <table>
    <tr><th></th><th>Maior</th><th>Menor</th></tr>
    <tr><td>Sistólica (máxima)</td><td>${cel(resumo.maiorSistolica, "sistolica")}</td><td>${cel(resumo.menorSistolica, "sistolica")}</td></tr>
    <tr><td>Diastólica (mínima)</td><td>${cel(resumo.maiorDiastolica, "diastolica")}</td><td>${cel(resumo.menorDiastolica, "diastolica")}</td></tr>
  </table>
  <h2>Evolução</h2>
  ${graficoSvg(medicoes, inicio.getTime(), fim.getTime())}
  <table><tr><th>Semana</th><th>Medições</th><th>Média (mmHg)</th><th>FC média</th></tr>${linhasSemana}</table>
  <h2>Por contexto</h2>
  <table><tr><th>Contexto</th><th>Medições</th><th>Média (mmHg)</th></tr>${linhasContexto}</table>
  <h2>Metas individuais</h2>
  <table><tr><th>Sistólica</th><th>Diastólica</th><th>Definidas por</th></tr>
    <tr><td>${escapar(descreverMeta(metas?.sistolica))}</td><td>${escapar(descreverMeta(metas?.diastolica))}</td>
    <td>${temMetas(metas) ? escapar(metas.profissional || "Não informado") : "—"}</td></tr></table>
  <h2>Medições do período</h2>
  <table><tr><th>Data e horário</th><th>mmHg</th><th>FC</th><th>Contexto</th><th>Braço</th><th>Atenção</th><th>Observações</th></tr>${linhasMedicoes}</table>
  <p class="nota">Relatório gerado pelo app Blood a partir dos registros do próprio paciente. Os avisos de atenção não são diagnóstico; uma medição isolada não define hipertensão. Este documento não substitui avaliação médica.</p>
</body></html>`;
}
