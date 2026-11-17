import React from "react";
import { Platform, Text, View } from "react-native";
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/GlicemiaStyle";
import {
  formatarData,
  inicioDoPeriodo,
  momentoDaMedicao,
  rotuloMomento,
} from "../dadosGlicemia";

// Gráfico de linha da glicemia (react-native-svg: funciona no Android, iOS e web).
// - Eixo X: tempo real (do início do período até agora), com datas de referência.
// - Eixo Y: mg/dL, com escala ajustada aos valores do período.
// - Toque ou arraste sobre o gráfico (ou passe o mouse, na web) para ver o valor
//   exato, a data, o horário e o momento da medição mais próxima.

const ALTURA = 220;
const MARGEM = { topo: 14, direita: 12, baixo: 28, esquerda: 40 };
const LARGURA_DICA = 156;
// Na web o texto do SVG usaria fonte serifada; usamos a mesma fonte do sistema do app.
const FONTE = Platform.OS === "web" ? "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" : undefined;

const dois = (n) => String(n).padStart(2, "0");
const diaMes = (data) => `${dois(data.getDate())}/${dois(data.getMonth() + 1)}`;

// Escolhe um passo "redondo" para as linhas de grade do eixo Y.
function escalaY(valores) {
  const menor = Math.min(...valores);
  const maior = Math.max(...valores);
  const folga = Math.max(10, (maior - menor) * 0.12);
  const bruto = (maior - menor + folga * 2) / 4;
  const passo = [10, 20, 25, 50, 100].find((p) => p >= bruto) ?? 100;
  const minimo = Math.max(0, Math.floor((menor - folga) / passo) * passo);
  const maximo = Math.ceil((maior + folga) / passo) * passo;
  const marcas = [];
  for (let v = minimo; v <= maximo; v += passo) marcas.push(v);
  return { minimo, maximo, marcas };
}

export const GraficoLinha = ({ medicoes, dias, destacarId = null }) => {
  const [largura, setLargura] = React.useState(0);
  const [selecionado, setSelecionado] = React.useState(null);
  const agora = React.useMemo(() => new Date(), [medicoes, dias]);

  // Ao trocar o período, a dica volta a apontar para a medição destacada (se houver).
  React.useEffect(() => {
    const indice = destacarId ? medicoes.findIndex((m) => m.id === destacarId) : -1;
    setSelecionado(indice >= 0 ? indice : null);
  }, [medicoes, dias, destacarId]);

  const area = {
    x: MARGEM.esquerda,
    y: MARGEM.topo,
    largura: Math.max(0, largura - MARGEM.esquerda - MARGEM.direita),
    altura: ALTURA - MARGEM.topo - MARGEM.baixo,
  };

  const { pontos, marcasY, marcasX, caminho } = React.useMemo(() => {
    if (!medicoes.length || area.largura <= 0) return { pontos: [], marcasY: [], marcasX: [], caminho: "" };
    const inicio = inicioDoPeriodo(dias, agora).getTime();
    const fim = agora.getTime();
    const escala = escalaY(medicoes.map((m) => m.valor));
    const x = (t) => area.x + ((t - inicio) / (fim - inicio)) * area.largura;
    const y = (v) => area.y + area.altura - ((v - escala.minimo) / (escala.maximo - escala.minimo)) * area.altura;

    const lista = medicoes.map((m) => {
      const quando = momentoDaMedicao(m);
      return { medicao: m, x: x(quando.getTime()), y: y(m.valor) };
    });

    // 4 a 5 datas de referência espalhadas pelo período.
    const divisoes = dias <= 7 ? dias - 1 : 4;
    const datas = [];
    for (let i = 0; i <= divisoes; i += 1) {
      const t = inicio + ((fim - inicio) * i) / divisoes;
      datas.push({ x: x(t), texto: diaMes(new Date(t)) });
    }

    return {
      pontos: lista,
      marcasY: escala.marcas.map((v) => ({ valor: v, y: y(v) })),
      marcasX: datas,
      caminho: lista.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "),
    };
  }, [medicoes, dias, agora, area.largura]);

  const selecionarPerto = (xToque) => {
    if (!pontos.length) return;
    let melhor = 0;
    pontos.forEach((p, i) => {
      if (Math.abs(p.x - xToque) < Math.abs(pontos[melhor].x - xToque)) melhor = i;
    });
    setSelecionado(melhor);
  };

  // Celular: sistema de toque do React Native (locationX já é relativo à área).
  const aoTocar = (evento) => selecionarPerto(evento.nativeEvent.locationX);
  // Web: eventos de ponteiro (mouse, toque e caneta), com a posição medida pela
  // própria área do gráfico, porque o alvo do evento pode ser um elemento interno.
  const areaRef = React.useRef(null);
  const aoPonteiro = (evento) => {
    const caixa = areaRef.current?.getBoundingClientRect?.();
    if (caixa) selecionarPerto(evento.nativeEvent.clientX - caixa.left);
  };
  const interacao =
    Platform.OS === "web"
      ? { onPointerDown: aoPonteiro, onPointerMove: aoPonteiro }
      : {
          onStartShouldSetResponder: () => true,
          onMoveShouldSetResponder: () => true,
          onResponderGrant: aoTocar,
          onResponderMove: aoTocar,
        };

  if (!medicoes.length) {
    return (
      <View style={[styles.grafico, styles.graficoVazio]}>
        <Text style={styles.vazioTexto}>Nenhuma medição neste período para mostrar no gráfico.</Text>
      </View>
    );
  }

  const ponto = selecionado != null ? pontos[selecionado] : null;
  const dicaX = ponto ? Math.min(Math.max(ponto.x - LARGURA_DICA / 2, 0), largura - LARGURA_DICA) : 0;
  const dicaAcima = ponto && ponto.y > ALTURA / 2;

  return (
    <View style={styles.grafico}>
      <View
        ref={areaRef}
        onLayout={(e) => setLargura(e.nativeEvent.layout.width)}
        style={{ height: ALTURA, touchAction: "pan-y" }}
        {...interacao}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Gráfico de glicemia dos últimos ${dias} dias com ${medicoes.length} medições`}
      >
        {largura > 0 && (
          <Svg width={largura} height={ALTURA} pointerEvents="none">
            {marcasY.map((m) => (
              <G key={`y${m.valor}`}>
                <Line
                  x1={area.x}
                  x2={area.x + area.largura}
                  y1={m.y}
                  y2={m.y}
                  stroke={color.borda}
                  strokeWidth={1}
                />
                <SvgText x={area.x - 6} y={m.y + 4} fontSize={10} fontFamily={FONTE} fill={color.textoSuave} textAnchor="end">
                  {m.valor}
                </SvgText>
              </G>
            ))}
            <SvgText x={4} y={MARGEM.topo - 4} fontSize={9} fontFamily={FONTE} fill={color.textoSuave}>
              mg/dL
            </SvgText>
            {marcasX.map((m, i) => (
              <SvgText
                key={`x${i}`}
                x={m.x}
                y={ALTURA - 8}
                fontSize={10} fontFamily={FONTE}
                fill={color.textoSuave}
                textAnchor={i === 0 ? "start" : i === marcasX.length - 1 ? "end" : "middle"}
              >
                {m.texto}
              </SvgText>
            ))}

            <Path d={caminho} stroke={color.colorModelThree} strokeWidth={2.5} fill="none" strokeLinejoin="round" />
            {pontos.map((p, i) => (
              <Circle
                key={p.medicao.id}
                cx={p.x}
                cy={p.y}
                r={i === selecionado ? 6 : pontos.length > 60 ? 2.5 : 3.5}
                fill={i === selecionado ? color.colorModelFour : color.colorModelOne}
                stroke={color.branco}
                strokeWidth={i === selecionado ? 2 : 1}
              />
            ))}
            {ponto && (
              <Line
                x1={ponto.x}
                x2={ponto.x}
                y1={area.y}
                y2={area.y + area.altura}
                stroke={color.colorModelFour}
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            )}
            <Rect
              x={area.x}
              y={area.y}
              width={area.largura}
              height={area.altura}
              fill="none"
              stroke={color.borda}
              strokeWidth={1}
            />
          </Svg>
        )}

        {ponto && (
          <View
            pointerEvents="none"
            style={[
              styles.dica,
              { width: LARGURA_DICA, left: dicaX },
              dicaAcima ? { top: MARGEM.topo } : { bottom: MARGEM.baixo + 4 },
            ]}
          >
            <Text style={styles.dicaValor}>{ponto.medicao.valor} mg/dL</Text>
            <Text style={styles.dicaTexto}>
              {formatarData(ponto.medicao.data)} às {ponto.medicao.hora}
            </Text>
            <Text style={styles.dicaTexto}>{rotuloMomento(ponto.medicao.momento)}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.legenda, { marginTop: 6 }]}>
        {ponto ? "Arraste para ver outras medições." : "Toque no gráfico para ver o valor exato de cada medição."}
      </Text>
    </View>
  );
};
