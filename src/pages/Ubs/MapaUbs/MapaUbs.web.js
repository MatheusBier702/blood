// Mapa no navegador: o mesmo Leaflet de MapaUbs.js, dentro de um iframe.
import React from "react";
import { View } from "react-native";
import { mapaHtml, FONTE_APP, FONTE_MAPA } from "./mapaHtml";

export const MapaUbs = ({ estado, onSelecionar, style }) => {
  const iframe = React.useRef(null);
  // Conta os carregamentos do mapa: a cada "pronto" o estado é enviado de novo.
  const [pronto, setPronto] = React.useState(0);
  const aoSelecionar = React.useRef(onSelecionar);
  aoSelecionar.current = onSelecionar;

  React.useEffect(() => {
    const aoReceber = (evento) => {
      if (evento.source !== iframe.current?.contentWindow) return;
      const dados = evento.data;
      if (!dados || dados.fonte !== FONTE_MAPA) return;
      if (dados.tipo === "pronto") setPronto((n) => n + 1);
      if (dados.tipo === "selecionar") aoSelecionar.current?.(dados.id);
    };
    window.addEventListener("message", aoReceber);
    return () => window.removeEventListener("message", aoReceber);
  }, []);

  React.useEffect(() => {
    if (!pronto) return;
    iframe.current?.contentWindow?.postMessage({ ...estado, tipo: "estado", fonte: FONTE_APP }, "*");
  }, [pronto, estado]);

  return (
    <View style={style}>
      <iframe
        ref={iframe}
        title="Mapa das UBSs próximas"
        srcDoc={mapaHtml}
        style={{ border: 0, width: "100%", height: "100%", display: "block" }}
      />
    </View>
  );
};
