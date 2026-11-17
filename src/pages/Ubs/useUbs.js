import React from "react";
import * as Location from "expo-location";
import { buscarRotaUbs, buscarUbsProximas } from "../../services/ubs";

// Busca a lista de novo quando a pessoa anda mais de 1 km.
const REBUSCAR_UNIDADES_KM = 1;
// Refaz a rota quando a pessoa se afasta 40 m do ponto de partida (no máximo a cada 15 s).
const REFAZER_ROTA_KM = 0.04;
const INTERVALO_ROTA_MS = 15000;

function distanciaKm(a, b) {
  const rad = (g) => (g * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

// Nova tentativa automática enquanto o servidor prepara a lista da cidade ou ainda
// confere endereços (no máximo algumas vezes, para não ficar em loop).
const ESPERA_REBUSCA_MS = 8000;
const MAX_REBUSCAS = 6;

// Explica o que deu errado em vez de uma mensagem genérica.
const mensagemDeErro = (erro, padrao) => {
  if (erro?.response?.data?.error) return erro.response.data.error;
  if (erro?.message?.startsWith("Configure ")) return erro.message;
  if (erro?.code === "ECONNABORTED" || /timeout/i.test(erro?.message || ""))
    return "A busca demorou demais para responder. Toque em \"Tentar de novo\".";
  if (erro?.response?.status === 404)
    return "O servidor do app não tem a busca de UBSs. Reinicie o Expo (npx.cmd expo start) para carregar as rotas novas.";
  if (erro?.response) return `${padrao} (erro ${erro.response.status} do servidor)`;
  return "Sem conexão com o servidor do app. Confira se o Expo (npx.cmd expo start) ou o servidor da API (node server.js) está rodando e, no celular, se ele está na mesma rede Wi-Fi do computador.";
};

export const useUbs = () => {
  const [permissao, setPermissao] = React.useState("pedindo"); // pedindo | negada | ok
  const [posicao, setPosicao] = React.useState(null);
  const [modo, setModo] = React.useState("pe"); // pe | carro
  const [dados, setDados] = React.useState(null); // { municipio, fonte, unidades }
  const [carregando, setCarregando] = React.useState(false);
  const [erro, setErro] = React.useState("");
  const [selecionadaId, setSelecionadaId] = React.useState(null);
  const [rota, setRota] = React.useState(null);
  const [carregandoRota, setCarregandoRota] = React.useState(false);
  const [erroRota, setErroRota] = React.useState("");
  const [centralizar, setCentralizar] = React.useState(0);
  const [tentativa, setTentativa] = React.useState(0);
  // Rebuscas automáticas (lista sendo preparada ou unidades ainda em conferência).
  const [rebusca, setRebusca] = React.useState(0);
  const [aviso, setAviso] = React.useState(""); // mensagem informativa (não é erro)
  const rebuscasFeitas = React.useRef(0);
  const timerRebusca = React.useRef(null);

  const ultimaBusca = React.useRef(null); // { ponto, modo }
  const ultimaRota = React.useRef(null); // { ponto, destinoId, modo, quando }
  const requisicao = React.useRef(0);
  const requisicaoRota = React.useRef(0);

  // 1) Permissão + acompanhamento da posição em tempo real.
  React.useEffect(() => {
    let assinatura = null;
    let ativo = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!ativo) return;
        if (status !== "granted") {
          setPermissao("negada");
          return;
        }
        setPermissao("ok");
        const aoMudar = (local) => {
          if (!ativo) return;
          setPosicao({
            lat: local.coords.latitude,
            lon: local.coords.longitude,
            precisao: local.coords.accuracy ? Math.round(local.coords.accuracy) : null,
            quando: local.timestamp,
          });
        };
        assinatura = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 10, timeInterval: 5000 },
          aoMudar,
          (motivo) => ativo && setErro(`Não foi possível acompanhar sua localização: ${motivo}`)
        );
        if (!ativo) assinatura.remove();
      } catch {
        if (ativo) setPermissao("negada");
      }
    })();
    return () => {
      ativo = false;
      assinatura?.remove();
    };
  }, [tentativa]);

  // 2) Lista das UBSs mais próximas (de novo quando anda 1 km ou troca o modo).
  React.useEffect(() => {
    if (!posicao) return;
    const anterior = ultimaBusca.current;
    const novoLugarOuModo =
      !anterior ||
      anterior.modo !== modo ||
      anterior.tentativa !== tentativa ||
      distanciaKm(anterior.ponto, posicao) > REBUSCAR_UNIDADES_KM;
    const precisaBuscar = novoLugarOuModo || anterior.rebusca !== rebusca;
    if (!precisaBuscar) return;
    if (novoLugarOuModo) rebuscasFeitas.current = 0;

    ultimaBusca.current = { ponto: posicao, modo, tentativa, rebusca };
    const id = ++requisicao.current;
    // Rebusca só para completar a lista: não mostra "carregando" por cima do que já está na tela.
    const silenciosa = !novoLugarOuModo;
    if (!silenciosa) setCarregando(true);
    setErro("");
    clearTimeout(timerRebusca.current);
    const agendarRebusca = () => {
      if (rebuscasFeitas.current >= MAX_REBUSCAS) return false;
      rebuscasFeitas.current += 1;
      timerRebusca.current = setTimeout(() => setRebusca((n) => n + 1), ESPERA_REBUSCA_MS);
      return true;
    };
    buscarUbsProximas(posicao, modo)
      .then((resposta) => {
        if (id !== requisicao.current) return;
        setDados(resposta);
        setAviso("");
        setCarregando(false);
        // Algumas unidades ainda estão tendo o endereço conferido: busca de novo para incluí-las.
        if (resposta.pendentes > 0) agendarRebusca();
      })
      .catch((e) => {
        if (id !== requisicao.current) return;
        if (e?.response?.status === 503 && e.response.data?.preparando && agendarRebusca()) {
          // A lista da cidade ainda está sendo baixada: avisa e tenta de novo sozinho.
          setAviso(`${e.response.data.error} Isso só acontece na primeira vez. Já vamos tentar de novo.`);
          setCarregando(true);
          return;
        }
        ultimaBusca.current = null; // deixa tentar de novo na próxima atualização
        setAviso("");
        setCarregando(false);
        setErro(mensagemDeErro(e, "Não foi possível buscar as UBSs agora. Tente novamente."));
      });
  }, [posicao, modo, tentativa, rebusca]);

  // Cancela uma nova tentativa agendada quando a tela é fechada.
  React.useEffect(() => () => clearTimeout(timerRebusca.current), []);

  const unidades = React.useMemo(() => dados?.unidades || [], [dados]);
  const selecionada = unidades.find((u) => u.id === selecionadaId) || null;

  // 3) Rota até a unidade escolhida, refeita enquanto a pessoa se move.
  React.useEffect(() => {
    if (!selecionada || !posicao) return;
    const anterior = ultimaRota.current;
    const mesmaRota = anterior && anterior.destinoId === selecionada.id && anterior.modo === modo;
    if (
      mesmaRota &&
      (distanciaKm(anterior.ponto, posicao) < REFAZER_ROTA_KM || Date.now() - anterior.quando < INTERVALO_ROTA_MS)
    ) {
      return;
    }
    ultimaRota.current = { ponto: posicao, destinoId: selecionada.id, modo, quando: Date.now() };
    const id = ++requisicaoRota.current;
    if (!mesmaRota) {
      setRota(null);
      setCarregandoRota(true);
    }
    setErroRota("");
    buscarRotaUbs(posicao, selecionada, modo)
      .then((resposta) => id === requisicaoRota.current && setRota(resposta))
      .catch((e) => {
        if (id !== requisicaoRota.current) return;
        if (!mesmaRota) ultimaRota.current = null;
        setErroRota(mensagemDeErro(e, "Não foi possível traçar a rota agora."));
      })
      .finally(() => id === requisicaoRota.current && setCarregandoRota(false));
  }, [selecionada, posicao, modo]);

  const selecionar = React.useCallback((id) => {
    setSelecionadaId((atual) => (atual === id ? null : id));
  }, []);

  React.useEffect(() => {
    if (selecionadaId) return;
    requisicaoRota.current += 1;
    ultimaRota.current = null;
    setRota(null);
    setErroRota("");
    setCarregandoRota(false);
  }, [selecionadaId]);

  const estadoMapa = React.useMemo(
    () => ({
      usuario: posicao,
      unidades,
      selecionada: selecionadaId,
      rota: rota?.pontos || null,
      centralizar,
    }),
    [posicao, unidades, selecionadaId, rota, centralizar]
  );

  return {
    permissao,
    posicao,
    modo,
    setModo,
    municipio: dados?.municipio || "",
    fonte: dados?.fonte || "",
    unidades,
    carregando,
    erro,
    aviso,
    pendentes: dados?.pendentes || 0,
    selecionada,
    selecionar,
    rota,
    carregandoRota,
    erroRota,
    estadoMapa,
    centralizarMapa: () => setCentralizar((n) => n + 1),
    tentarDeNovo: () => {
      setErro("");
      setAviso("");
      rebuscasFeitas.current = 0;
      setTentativa((n) => n + 1);
    },
  };
};
