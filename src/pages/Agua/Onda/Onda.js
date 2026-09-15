import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, Dimensions } from "react-native";
import { styles } from "../../../screen/css/OndaStyle";

const LARGURA_TELA = Dimensions.get("window").width;

// Quanto a curva "esticada" (scaleX) fica mais larga que a tela.
// Quanto maior, mais suave a ondulação.
const ESTICAR = 2;

// porcentagem: valor mostrado na etiqueta (0 a 100, mas pode passar de 100
//              quando o consumo passa do objetivo). A altura da água na tela
//              acompanha esse valor (limitada a 100%) e sobe/desce animada
//              toda vez que o usuário bebe água.
export const Onda = ({ porcentagem = 0 }) => {
  const progresso = useRef(new Animated.Value(0)).current;

  // Controla a altura da água (0 a 100 = 0% a 100% do container).
  // É essa Animated.Value que faz a etiquetazinha e a curva subirem
  // suavemente junto, em vez de pular direto pro valor novo.
  const alturaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Vai e volta (0 -> 1 -> 0) suavemente, em loop
    const animacao = Animated.loop(
      Animated.sequence([
        Animated.timing(progresso, {
          toValue: 1,
          duration: 3500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(progresso, {
          toValue: 0,
          duration: 3500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    animacao.start();
    return () => animacao.stop();
  }, [progresso]);

  useEffect(() => {
    // A água nunca ocupa mais que 100% do espaço, mesmo que a
    // porcentagem mostrada na etiqueta passe de 100%.
    const alvo = Math.max(0, Math.min(porcentagem, 100));

    Animated.timing(alturaAnim, {
      toValue: alvo,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      // height não pode ser animado pelo driver nativo
      useNativeDriver: false,
    }).start();
  }, [porcentagem, alturaAnim]);

  const alturaInterpolada = alturaAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  // A curva da frente balança para um lado e a de trás para o outro,
  // com uma leve subida/descida, imitando o movimento do mar.
  const frenteX = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: [-LARGURA_TELA * 0.25, LARGURA_TELA * 0.25],
  });
  const frenteY = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });

  const fundoX = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: [LARGURA_TELA * 0.3, -LARGURA_TELA * 0.3],
  });
  const fundoY = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  return (
    <Animated.View style={[styles.container, { height: alturaInterpolada }]}>
      {/* curva de trás (mais clara) */}
      <Animated.View
        style={[
          styles.curva,
          styles.curvaFundo,
          {
            transform: [
              { translateX: fundoX },
              { translateY: fundoY },
              { scaleX: ESTICAR },
            ],
          },
        ]}
      />

      {/* corpo da água */}
      <View style={styles.agua} />

      {/* curva da frente */}
      <Animated.View
        style={[
          styles.curva,
          {
            transform: [
              { translateX: frenteX },
              { translateY: frenteY },
              { scaleX: ESTICAR },
            ],
          },
        ]}
      />

      {/* etiqueta com a porcentagem */}
      <View style={styles.etiqueta}>
        <View style={styles.etiquetaCaixa}>
          <Text style={styles.etiquetaTexto}>{porcentagem}%</Text>
        </View>
        <View style={styles.etiquetaPonta} />
      </View>
    </Animated.View>
  );
};
