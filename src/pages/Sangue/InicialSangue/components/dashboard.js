import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  TIPOS_SANGUINEOS,
  podeDoar,
  tipoSanguineoValido,
} from "../../compatibilidade";

export const Dashboard = ({ tipoSangue, onAlterarTipo }) => {
  const [modo, setModo] = useState("doar");
  const [reduzirMovimento, setReduzirMovimento] = useState(true);
  const movimento = useRef(new Animated.Value(0)).current;
  const focado = useIsFocused();
  const valido = tipoSanguineoValido(tipoSangue);

  useEffect(() => {
    let ativo = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((valor) => {
        if (ativo) setReduzirMovimento(valor);
      })
      .catch(() => {});
    const evento = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduzirMovimento
    );
    return () => {
      ativo = false;
      evento.remove();
    };
  }, []);

  useEffect(() => {
    movimento.setValue(0);
    if (reduzirMovimento || !focado || !valido) return;
    const animacao = Animated.loop(
      Animated.sequence([
        Animated.timing(movimento, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
          isInteraction: false,
        }),
        Animated.timing(movimento, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
          isInteraction: false,
        }),
      ])
    );
    animacao.start();
    return () => animacao.stop();
  }, [movimento, reduzirMovimento, focado, valido]);

  if (!valido) {
    return (
      <View style={styles.card}>
        <Text style={styles.titulo}>Informe seu tipo sanguíneo</Text>
        <Text style={styles.descricao}>
          Selecione um tipo válido para consultar a compatibilidade.
        </Text>
        {onAlterarTipo && (
          <Pressable
            accessibilityRole="button"
            onPress={onAlterarTipo}
            style={styles.alterar}
          >
            <Text style={styles.link}>Selecionar tipo sanguíneo</Text>
          </Pressable>
        )}
      </View>
    );
  }

  const doando = modo === "doar";
  const compativeis = TIPOS_SANGUINEOS.filter((tipo) =>
    doando ? podeDoar(tipoSangue, tipo) : podeDoar(tipo, tipoSangue)
  );

  return (
    <View style={styles.card}>
      <View style={styles.cabecalho}>
        <Text style={styles.selo}>SEU TIPO SANGUÍNEO</Text>
        {onAlterarTipo && (
          <Pressable
            accessibilityRole="button"
            onPress={onAlterarTipo}
            hitSlop={8}
          >
            <Text style={styles.link}>Alterar tipo</Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.titulo}>Uma conexão que salva vidas</Text>
      <View
        style={styles.ilustracao}
        accessible
        accessibilityLabel={`Bolsa de sangue do seu tipo: ${tipoSangue}`}
      >
        <Animated.View
          style={{
            alignItems: "center",
            transform: [
              {
                translateY: movimento.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -8],
                }),
              },
            ],
          }}
        >
          <View style={styles.alca} />
          <View style={styles.bolsa}>
            <Animated.View
              style={[
                styles.liquido,
                {
                  transform: [
                    {
                      translateY: movimento.interpolate({
                        inputRange: [0, 1],
                        outputRange: [8, -6],
                      }),
                    },
                    {
                      rotate: movimento.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["-3deg", "3deg"],
                      }),
                    },
                  ],
                },
              ]}
            />
            <View style={styles.etiqueta}>
              <Text style={styles.cruz}>+</Text>
              <Text style={styles.tipo}>{tipoSangue}</Text>
              <Text style={styles.etiquetaTexto}>SEU SANGUE</Text>
            </View>
          </View>
          <View style={styles.saida} />
          <View style={styles.tubo} />
        </Animated.View>
      </View>
      <View style={styles.abas}>
        {[
          ["doar", "Posso doar para"],
          ["receber", "Posso receber de"],
        ].map(([valor, titulo]) => (
          <Pressable
            key={valor}
            accessibilityRole="tab"
            accessibilityState={{ selected: modo === valor }}
            onPress={() => setModo(valor)}
            style={[styles.aba, modo === valor && styles.abaAtiva]}
          >
            <Text
              style={[styles.abaTexto, modo === valor && styles.abaTextoAtiva]}
            >
              {titulo}
            </Text>
          </Pressable>
        ))}
      </View>
      <View accessibilityLiveRegion="polite" style={styles.resumo}>
        <Text style={styles.subtitulo}>
          {doando ? "Você pode doar para" : "Você pode receber de"}
        </Text>
        <Text style={styles.descricao}>{compativeis.join(" · ")}</Text>
      </View>
      <View style={styles.grade}>
        {TIPOS_SANGUINEOS.map((tipo) => {
          const compativel = compativeis.includes(tipo);
          return (
            <View
              key={tipo}
              accessible
              accessibilityLabel={`${
                doando
                  ? `${tipoSangue} doa para ${tipo}`
                  : `${tipoSangue} recebe de ${tipo}`
              }: ${compativel ? "compatível" : "incompatível"}`}
              style={[styles.tipoCard, compativel && styles.tipoCompativel]}
            >
              <Text
                style={[
                  styles.tipoNumero,
                  compativel && styles.textoCompativel,
                ]}
              >
                {tipo}
              </Text>
              <Text
                style={[styles.status, compativel && styles.textoCompativel]}
              >
                {compativel ? "✓ Compatível" : "× Incompatível"}
              </Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.nota}>
        Compatibilidade de hemácias pelo sistema ABO/Rh. A transfusão depende de
        testes de compatibilidade e avaliação profissional.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 680,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    gap: 20,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
  },
  selo: {
    color: "#68776F",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  link: {
    color: "#B4233C",
    fontWeight: "600",
    fontSize: 14,
  },
  alterar: {
    paddingVertical: 12,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#23352B",
  },
  descricao: {
    fontSize: 16,
    color: "#617068",
    lineHeight: 24,
  },
  ilustracao: {
    backgroundColor: "#FFF3F4",
    borderRadius: 20,
    alignItems: "center",
    paddingTop: 26,
    paddingBottom: 12,
  },
  alca: {
    width: 36,
    height: 20,
    borderWidth: 5,
    borderColor: "#CDA4AB",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    marginBottom: -3,
  },
  bolsa: {
    width: 138,
    height: 170,
    backgroundColor: "#FFE2E7",
    borderWidth: 3,
    borderColor: "#CDA4AB",
    borderRadius: 26,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  liquido: {
    position: "absolute",
    bottom: -18,
    left: -14,
    width: 162,
    height: 142,
    backgroundColor: "#BE2945",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 48,
  },
  etiqueta: {
    backgroundColor: "#FFF",
    width: 96,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  cruz: {
    fontSize: 24,
    lineHeight: 26,
    color: "#BE2945",
    fontWeight: "700",
  },
  tipo: {
    fontSize: 34,
    color: "#9F2038",
    fontWeight: "800",
  },
  etiquetaTexto: {
    fontSize: 9,
    color: "#68776F",
    fontWeight: "700",
  },
  saida: {
    width: 20,
    height: 12,
    backgroundColor: "#CDA4AB",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  tubo: {
    width: 30,
    height: 32,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: "#CDA4AB",
    borderBottomLeftRadius: 18,
    marginLeft: 26,
  },
  abas: {
    flexDirection: "row",
    backgroundColor: "#F2F6F3",
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  aba: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  abaAtiva: {
    backgroundColor: "#B4233C",
  },
  abaTexto: {
    color: "#617068",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  abaTextoAtiva: {
    color: "#FFF",
  },
  resumo: {
    gap: 6,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#23352B",
  },
  grade: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tipoCard: {
    flexBasis: "45%",
    flexGrow: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E1E5E3",
    backgroundColor: "#F8F9F8",
    alignItems: "center",
    gap: 6,
  },
  tipoCompativel: {
    borderColor: "#91C3A2",
    backgroundColor: "#EAF6EE",
  },
  tipoNumero: {
    color: "#737D77",
    fontSize: 26,
    fontWeight: "700",
  },
  status: {
    color: "#737D77",
    fontSize: 12,
  },
  textoCompativel: {
    color: "#22643B",
  },
  nota: {
    color: "#68776F",
    fontSize: 12,
    lineHeight: 18,
  },
});
