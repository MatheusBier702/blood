// Página HTML do mapa (Leaflet + OpenStreetMap). Roda dentro de uma WebView no
// celular e de um iframe na web. Conversa com o app por mensagens:
//   app -> mapa: { tipo: "estado", usuario, unidades, selecionada, rota, centralizar }
//   mapa -> app: { tipo: "pronto" } e { tipo: "selecionar", id }
import color from "../../../screen/Colors/cor";

export const FONTE_APP = "app-ubs";
export const FONTE_MAPA = "mapa-ubs";

export const mapaHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #mapa { margin: 0; height: 100%; width: 100%; background: ${color.fundo}; }
  .leaflet-container { font-family: -apple-system, Segoe UI, Roboto, sans-serif; }
  .voce { width: 18px; height: 18px; border-radius: 50%; background: ${color.colorModelThree};
    border: 3px solid #fff; box-shadow: 0 0 0 2px ${color.colorModelThree}55, 0 2px 6px #0004; box-sizing: border-box; }
  .pino { width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
    background: ${color.colorModelFour}; border: 2px solid #fff; box-shadow: 0 2px 6px #0005;
    display: flex; align-items: center; justify-content: center; box-sizing: border-box; }
  .pino span { transform: rotate(45deg); color: #fff; font: 700 12px sans-serif; }
  .pino.ativo { background: ${color.vermelho}; width: 38px; height: 38px; }
  .pino.ativo span { font-size: 14px; }
  .aviso { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    color: ${color.textoSuave}; font: 14px sans-serif; text-align: center; padding: 24px; z-index: 999; }
</style>
</head>
<body>
<div id="mapa"></div>
<div id="aviso" class="aviso">Carregando mapa…</div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
(function () {
  function enviar(msg) {
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(msg));
    else if (window.parent !== window) {
      msg.fonte = "${FONTE_MAPA}";
      window.parent.postMessage(msg, "*");
    }
  }
  var aviso = document.getElementById("aviso");
  if (!window.L) {
    aviso.textContent = "Não foi possível carregar o mapa. Verifique a internet.";
    return;
  }
  aviso.remove();

  var mapa = L.map("mapa", { zoomControl: true, attributionControl: true }).setView([-15.78, -47.93], 4);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(mapa);

  var marcadorVoce = null, circuloPrecisao = null, linhaRota = null;
  var marcadores = {};
  var chaveUnidades = "", chaveRota = "", ultimoCentralizar = -1, centralizouUmaVez = false;

  function iconeUnidade(numero, ativo) {
    return L.divIcon({
      className: "",
      html: '<div class="pino' + (ativo ? " ativo" : "") + '"><span>' + numero + "</span></div>",
      iconSize: ativo ? [38, 38] : [30, 30],
      iconAnchor: ativo ? [19, 38] : [15, 30],
    });
  }

  function atualizarUnidades(unidades, selecionada) {
    var chave = unidades.map(function (u) { return u.id + "@" + u.lat + "," + u.lon; }).join("|");
    if (chave !== chaveUnidades) {
      Object.keys(marcadores).forEach(function (id) { mapa.removeLayer(marcadores[id]); });
      marcadores = {};
      unidades.forEach(function (u, i) {
        var m = L.marker([u.lat, u.lon], { icon: iconeUnidade(i + 1, false), title: u.nome });
        m.on("click", function () { enviar({ tipo: "selecionar", id: u.id }); });
        m.numero = i + 1;
        m.addTo(mapa);
        marcadores[u.id] = m;
      });
      chaveUnidades = chave;
    }
    Object.keys(marcadores).forEach(function (id) {
      var m = marcadores[id], ativo = id === selecionada;
      m.setIcon(iconeUnidade(m.numero, ativo));
      m.setZIndexOffset(ativo ? 1000 : 0);
    });
  }

  function atualizarRota(rota) {
    var chave = rota && rota.length ? rota.length + ":" + rota[0] + ":" + rota[rota.length - 1] : "";
    if (chave === chaveRota) return false;
    chaveRota = chave;
    if (linhaRota) { mapa.removeLayer(linhaRota); linhaRota = null; }
    if (!chave) return false;
    linhaRota = L.polyline(rota, { color: "${color.colorModelOne}", weight: 6, opacity: 0.85 }).addTo(mapa);
    return true;
  }

  function atualizarUsuario(u) {
    if (!u) return;
    var ponto = [u.lat, u.lon];
    if (!marcadorVoce) {
      marcadorVoce = L.marker(ponto, {
        icon: L.divIcon({ className: "", html: '<div class="voce"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
        zIndexOffset: 2000,
        title: "Você está aqui",
      }).addTo(mapa);
      circuloPrecisao = L.circle(ponto, { radius: u.precisao || 0, color: "${color.colorModelThree}", weight: 1, fillOpacity: 0.08 }).addTo(mapa);
    } else {
      marcadorVoce.setLatLng(ponto);
      circuloPrecisao.setLatLng(ponto);
      circuloPrecisao.setRadius(u.precisao || 0);
    }
  }

  window.receber = function (estado) {
    if (!estado || estado.tipo !== "estado") return;
    atualizarUsuario(estado.usuario);
    atualizarUnidades(estado.unidades || [], estado.selecionada);
    var rotaNova = atualizarRota(estado.rota);

    if (rotaNova && linhaRota) {
      mapa.fitBounds(linhaRota.getBounds(), { padding: [40, 40] });
    } else if (estado.usuario && (!centralizouUmaVez || estado.centralizar !== ultimoCentralizar)) {
      var pontos = [[estado.usuario.lat, estado.usuario.lon]];
      if (!centralizouUmaVez) {
        (estado.unidades || []).slice(0, 3).forEach(function (u) { pontos.push([u.lat, u.lon]); });
      }
      if (pontos.length > 1) mapa.fitBounds(pontos, { padding: [40, 40], maxZoom: 16 });
      else mapa.setView(pontos[0], 16);
      centralizouUmaVez = (estado.unidades || []).length > 0 || centralizouUmaVez;
    }
    ultimoCentralizar = estado.centralizar;
  };

  window.addEventListener("message", function (evento) {
    var dados = evento.data;
    if (typeof dados === "string") { try { dados = JSON.parse(dados); } catch (e) { return; } }
    if (dados && dados.fonte === "${FONTE_APP}") window.receber(dados);
  });

  enviar({ tipo: "pronto" });
})();
</script>
</body>
</html>`;
