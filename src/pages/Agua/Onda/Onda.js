import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, Dimensions } from "react-native";
import { styles } from "../../../screen/css/OndaStyle";

const LARGURA_TELA = Dimensions.get("window").width;

// Quanto a curva "esticada" (scaleX) fica mais larga que a tela.
// Quanto maior, mais suave a ondulação.
const ESTICAR = 2;

// porcentagem: valor mostrado na etiqueta (0 a 100)
// altura: altura da água na tela (por enquanto fixa; depois vai
//         acompanhar a porcentagem quando o usuário beber)
export const Onda = ({ porcentagem = 0, altura = "56%" }) => {
  const progresso = useRef(new Animated.Value(0)).current;

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
    <View style={[styles.container, { height: altura }]}>
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
    </View>
  );
};
