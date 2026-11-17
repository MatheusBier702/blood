import React from "react";
import { ActivityIndicator, Animated, Easing, Image, Platform, Pressable, Text, View } from "react-native";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/MeditacaoStyle";
import { NIVEIS_VOLUME } from "../dadosSons";

const usarDriverNativo = Platform.OS !== "web";

// Barrinhas animadas que indicam que o som está tocando.
const Equalizador = () => {
  const barras = React.useRef([0, 1, 2, 3].map(() => new Animated.Value(0.3))).current;
  React.useEffect(() => {
    const animacoes = barras.map((valor, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(valor, { toValue: 1, duration: 380 + i * 90, easing: Easing.inOut(Easing.quad), useNativeDriver: usarDriverNativo }),
          Animated.timing(valor, { toValue: 0.3, duration: 380 + i * 90, easing: Easing.inOut(Easing.quad), useNativeDriver: usarDriverNativo }),
        ])
      )
    );
    animacoes.forEach((a) => a.start());
    return () => animacoes.forEach((a) => a.stop());
  }, [barras]);
  return (
    <View style={styles.equalizador} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {barras.map((valor, i) => (
        <Animated.View key={i} style={[styles.equalizadorBarra, { transform: [{ scaleY: valor }], transformOrigin: "bottom" }]} />
      ))}
    </View>
  );
};

export const CardSom = ({ som, estado, onAlternar, onVolume }) => {
  const { tocando, carregando, pausado, erro, volume } = estado;
  const ativo = tocando || carregando;

  const textoEstado = carregando ? "Carregando…" : tocando ? "Tocando" : pausado ? "Pausado" : "Toque para ouvir";

  return (
    <View style={[styles.som, ativo && styles.somAtivo]}>
      <View style={styles.somTopo}>
        <View style={[styles.somIcone, ativo && styles.somIconeAtivo]}>
          <Image source={som.icone} style={styles.somImagem} resizeMode="contain" accessibilityIgnoresInvertColors />
        </View>
        <Text style={styles.somNome}>{som.nome}</Text>
      </View>

      <Text style={styles.somDescricao}>{som.descricao}</Text>

      <View style={styles.somControles}>
        <Pressable
          onPress={() => onAlternar(som)}
          accessibilityRole="button"
          accessibilityLabel={tocando ? `Pausar ${som.nome}` : `Tocar ${som.nome}`}
          accessibilityState={{ busy: carregando }}
          hitSlop={6}
          style={({ pressed }) => [styles.botaoTocar, pressed && styles.pressionado]}
        >
          {carregando ? (
            <ActivityIndicator color={color.branco} size="small" />
          ) : tocando ? (
            <View style={styles.pausa}>
              <View style={styles.pausaBarra} />
              <View style={styles.pausaBarra} />
            </View>
          ) : (
            <View style={styles.triangulo} />
          )}
        </Pressable>
        <View style={styles.somEstado}>
          <Text style={[styles.somEstadoTexto, ativo && styles.somEstadoTextoAtivo]}>{textoEstado}</Text>
          {tocando && <Equalizador />}
        </View>
      </View>

      <View
        style={styles.volume}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={`Volume de ${som.nome}`}
        accessibilityValue={{ min: 1, max: NIVEIS_VOLUME, now: volume }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(e) => onVolume(som, volume + (e.nativeEvent.actionName === "increment" ? 1 : -1))}
      >
        <Pressable
          onPress={() => onVolume(som, volume - 1)}
          accessibilityRole="button"
          accessibilityLabel="Diminuir volume"
          disabled={volume <= 1}
          style={({ pressed }) => [styles.volumeBotao, volume <= 1 && { opacity: 0.4 }, pressed && styles.pressionado]}
        >
          <Text style={styles.volumeBotaoTexto}>−</Text>
        </Pressable>
        <View style={styles.volumeNiveis}>
          {Array.from({ length: NIVEIS_VOLUME }, (_, i) => (
            <Pressable
              key={i}
              onPress={() => onVolume(som, i + 1)}
              accessibilityRole="button"
              accessibilityLabel={`Volume ${i + 1} de ${NIVEIS_VOLUME}`}
              style={[styles.volumeNivel, { height: 8 + i * 3.5 }, i < volume && styles.volumeNivelAtivo]}
            />
          ))}
        </View>
        <Pressable
          onPress={() => onVolume(som, volume + 1)}
          accessibilityRole="button"
          accessibilityLabel="Aumentar volume"
          disabled={volume >= NIVEIS_VOLUME}
          style={({ pressed }) => [styles.volumeBotao, volume >= NIVEIS_VOLUME && { opacity: 0.4 }, pressed && styles.pressionado]}
        >
          <Text style={styles.volumeBotaoTexto}>+</Text>
        </Pressable>
      </View>

      {!!erro && <Text style={[styles.erroCampo, { marginTop: 10 }]}>{erro}</Text>}
      <Text style={styles.creditoSom}>Áudio: {som.credito}</Text>
    </View>
  );
};
