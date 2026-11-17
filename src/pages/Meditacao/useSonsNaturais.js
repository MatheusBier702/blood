import React from "react";
import { Platform } from "react-native";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { NIVEIS_VOLUME, SONS_NATURAIS, VOLUME_INICIAL, nivelParaVolume } from "./dadosSons";

const ERRO_PADRAO = "Não foi possível reproduzir este som. Tente novamente.";
const ERRO_SERVIDOR =
  "Não foi possível baixar o áudio: o Expo que abriu esta página não está respondendo. Inicie o Expo (npx.cmd expo start) e recarregue a página.";

// Na web os áudios vêm do mesmo servidor que entregou a página. Se ele não
// responder, a mensagem explica isso em vez de um erro genérico.
async function mensagemDeFalha() {
  if (Platform.OS !== "web" || typeof window === "undefined") return ERRO_PADRAO;
  try {
    await fetch(window.location.origin, { method: "HEAD", cache: "no-store" });
    return ERRO_PADRAO;
  } catch {
    return ERRO_SERVIDOR;
  }
}

// Controla a reprodução dos sons naturais com UM único player do expo-audio.
// Por isso nunca tocam dois sons ao mesmo tempo: escolher outro som troca a fonte
// do mesmo player (o anterior para na hora). O player é liberado quando a tela
// sai da pilha de navegação.
export const useSonsNaturais = () => {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  const [atualId, setAtualId] = React.useState(null); // som carregado no player
  const [carregando, setCarregando] = React.useState(false);
  const [erros, setErros] = React.useState({}); // id -> mensagem
  const [volumes, setVolumes] = React.useState(() =>
    Object.fromEntries(SONS_NATURAIS.map((som) => [som.id, VOLUME_INICIAL]))
  );

  // Toca mesmo com o iPhone no modo silencioso e para quando o app vai para segundo plano.
  React.useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: false }).catch(() => {});
  }, []);

  // Fica "carregando" até o player confirmar que o novo som começou (ou falhou).
  React.useEffect(() => {
    if (status.playing || status.error) setCarregando(false);
  }, [status.playing, status.error]);

  // Erro vindo do player (arquivo inválido, formato não suportado, etc.).
  React.useEffect(() => {
    if (!status.error || !atualId) return;
    const id = atualId;
    setErros((atual) => ({ ...atual, [id]: ERRO_PADRAO }));
    setCarregando(false);
    mensagemDeFalha().then((texto) => setErros((atual) => (atual[id] ? { ...atual, [id]: texto } : atual)));
  }, [status.error, atualId]);

  // Se o player não confirmar a reprodução em 10 s, avisa em vez de ficar carregando para sempre.
  React.useEffect(() => {
    if (!carregando) return undefined;
    const id = setTimeout(() => {
      setCarregando(false);
      if (!player.playing) {
        const id = atualId;
        setErros((atual) => ({ ...atual, [id]: "O som demorou demais para carregar. Tente novamente." }));
        mensagemDeFalha().then((texto) => {
          if (texto === ERRO_SERVIDOR) setErros((atual) => ({ ...atual, [id]: texto }));
        });
      }
    }, 10000);
    return () => clearTimeout(id);
  }, [carregando, atualId, player]);

  const alternar = (som) => {
    setErros((atual) => ({ ...atual, [som.id]: undefined }));
    try {
      if (atualId === som.id && !status.error) {
        if (player.playing) {
          player.pause();
        } else {
          player.play();
        }
        return;
      }
      // Novo som: troca a fonte do mesmo player, o que interrompe o anterior.
      player.pause();
      player.replace(som.audio);
      player.loop = true;
      player.volume = nivelParaVolume(volumes[som.id]);
      setAtualId(som.id);
      setCarregando(true);
      player.play();
    } catch {
      setCarregando(false);
      setErros((atual) => ({ ...atual, [som.id]: ERRO_PADRAO }));
    }
  };

  const parar = () => {
    try {
      player.pause();
      player.seekTo(0).catch(() => {});
    } catch {
      // nada a fazer: o player já está parado
    }
  };

  const mudarVolume = (som, nivel) => {
    const limitado = Math.max(1, Math.min(NIVEIS_VOLUME, nivel));
    setVolumes((atual) => ({ ...atual, [som.id]: limitado }));
    if (atualId === som.id) {
      try {
        player.volume = nivelParaVolume(limitado);
      } catch {
        // volume é ajustado de novo na próxima reprodução
      }
    }
  };

  const estadoDe = (som) => {
    const ativo = atualId === som.id;
    return {
      tocando: ativo && status.playing,
      carregando: ativo && carregando && !status.playing,
      pausado: ativo && !status.playing && !carregando && status.currentTime > 0,
      erro: erros[som.id],
      volume: volumes[som.id],
    };
  };

  const somTocando = SONS_NATURAIS.find((som) => som.id === atualId && status.playing) || null;

  return { alternar, parar, mudarVolume, estadoDe, somTocando };
};
