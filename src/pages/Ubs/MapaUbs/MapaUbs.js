// Mapa no celular (Android/iOS): Leaflet dentro de uma WebView.
// A versão para navegador fica em MapaUbs.web.js.
import React from "react";
import { WebView } from "react-native-webview";
import { mapaHtml, FONTE_APP } from "./mapaHtml";

export const MapaUbs = ({ estado, onSelecionar, style }) => {
  const webview = React.useRef(null);
  // Conta os carregamentos do mapa: a cada "pronto" o estado é enviado de novo.
  const [pronto, setPronto] = React.useState(0);

  React.useEffect(() => {
    if (!pronto || !webview.current) return;
    const mensagem = JSON.stringify({ ...estado, tipo: "estado", fonte: FONTE_APP });
    webview.current.injectJavaScript(`window.receber && window.receber(${mensagem}); true;`);
  }, [pronto, estado]);

  const aoReceber = (evento) => {
    let dados;
    try {
      dados = JSON.parse(evento.nativeEvent.data);
    } catch {
      return;
    }
    if (dados.tipo === "pronto") setPronto((n) => n + 1);
    if (dados.tipo === "selecionar") onSelecionar?.(dados.id);
  };

  return (
    <WebView
      ref={webview}
      style={style}
      originWhitelist={["*"]}
      source={{ html: mapaHtml, baseUrl: "https://localhost/" }}
      onMessage={aoReceber}
      onLoadStart={() => setPronto(0)}
      javaScriptEnabled
      domStorageEnabled
      setSupportMultipleWindows={false}
      nestedScrollEnabled
    />
  );
};
