import React from "react";
import { Platform, Text, View } from "react-native";
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import color from "../../../screen/Colors/cor";
import { CORES_PRESSAO, styles } from "../../../screen/css/PressaoStyle";
import {
  formatarData,
  formatarFrequencia,
  inicioDoPeriodo,
  momentoDaMedicao,
  rotuloContexto,
} from "../dadosPressao";

// Gráfico da pressão arterial com react-native-svg (o mesmo usado no gráfico da
// Glicemia; funciona no Android, iOS e web, sem bibliotecas extras).
// - Duas séries diferenciadas por cor E por forma do ponto:
//   sistólica = linha contínua com círculos; diastólica = linha tracejada com quadrados.
// - Linhas pontilhadas mostram as metas máximas cadastradas (se houver).
// - Toque/arraste (ou passe o mouse na web) para ver os valores exatos.

const ALTURA = 240;
const MARGEM = { topo: 14, direita: 12, baixo: 28, esquerda: 40 };
const LARGURA_DICA = 168;
const FONTE = Platform.OS === "web" ? "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" : undefined;

const dois = (n) => String(n).padStart(2, "0");
const diaMes = (data) => `${dois(data.getDate())}/${dois(data.getMonth() + 1)}`;

function escalaY(valores) {
  const menor = Math.min(...valores);
  const maior = Math.max(...valores);
  const folga = Math.max(8, (maior - menor) * 0.1);
  const bruto = (maior - menor + folga * 2) / 5;
  const passo = [10, 20, 25, 50].find((p) => p >= bruto) ?? 50;
  const minimo = Math.max(0, Math.floor((menor - folga) / passo) * passo);
  const maximo = Math.ceil((maior + folga) / passo) * passo;
  const marcas = [];
  for (let v = minimo; v <= maximo; v += passo) marcas.push(v);
  return { minimo, maximo, marcas };
}

export const LegendaPressao = ({ comMetas = false }) => (
  <View style={styles.legendaGrafico}>
    <View style={styles.legendaItem}>
      <View style={[styles.legendaLinha, { backgroundColor: CORES_PRESSAO.sistolica }]} />
      <Text style={styles.legendaTexto}>Sistólica (máxima)</Text>
    </View>
    <View style={styles.legendaItem}>
      <View style={[styles.legendaLinha, { backgroundColor: CORES_PRESSAO.diastolica }]} />
      <Text style={styles.legendaTexto}>Diastólica (mínima)</Text>
    </View>
    {comMetas && (
      <View style={styles.legendaItem}>
        <View style={[styles.legendaLinha, { backgroundColor: color.vermelho, opacity: 0.6 }]} />
        <Text style={styles.legendaTexto}>Meta máxima</Text>
      </View>
    )}
  </View>
);

export const GraficoLinhasPressao = ({ medicoes, dias, metas }) => {
  const [largura, setLargura] = React.useState(0);
  const [selecionado, setSelecionado] = React.useState(null);
  const agora = React.useMemo(() => new Date(), [medicoes, dias]);
  const areaRef = React.useRef(null);

  React.useEffect(() => setSelecionado(null), [medicoes, dias]);

  const area = {
    x: MARGEM.esquerda,
    y: MARGEM.topo,
    largura: Math.max(0, largura - MARGEM.esquerda - MARGEM.direita),
    altura: ALTURA - MARGEM.topo - MARGEM.baixo,
  };
  const metaSis = metas?.sistolica?.maximo ?? null;
  const metaDia = metas?.diastolica?.maximo ?? null;

  const dados = React.useMemo(() => {
    if (!medicoes.length || area.largura <= 0) return null;
    const inicio = inicioDoPeriodo(dias, agora).getTime();
    const fim = agora.getTime();
    const valores = medicoes.flatMap((m) => [m.sistolica, m.diastolica]);
    if (metaSis != null) valores.push(metaSis);
    if (metaDia != null) valores.push(metaDia);
    const escala = escalaY(valores);
    const x = (t) => area.x + ((t - inicio) / (fim - inicio)) * area.largura;
    const y = (v) => area.y + area.altura - ((v - escala.minimo) / (escala.maximo - escala.minimo)) * area.altura;

    const pontos = medicoes.map((m) => ({
      medicao: m,
      x: x(momentoDaMedicao(m).getTime()),
      ySis: y(m.sistolica),
      yDia: y(m.diastolica),
    }));
    const caminho = (chave) => pontos.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p[chave].toFixed(1)}`).join(" ");
    const divisoes = dias <= 7 ? dias - 1 : 4;
    const datas = [];
    for (let i = 0; i <= divisoes; i += 1) {
      const t = inicio + ((fim - inicio) * i) / divisoes;
      datas.push({ x: x(t), texto: diaMes(new Date(t)) });
    }
    return {
      pontos,
      caminhoSis: caminho("ySis"),
      caminhoDia: caminho("yDia"),
      marcasY: escala.marcas.map((v) => ({ valor: v, y: y(v) })),
      marcasX: datas,
      yMetaSis: metaSis != null ? y(metaSis) : null,
      yMetaDia: metaDia != null ? y(metaDia) : null,
    };
  }, [medicoes, dias, agora, area.largura, metaSis, metaDia]);

  const selecionarPerto = (xToque) => {
    if (!dados?.pontos.length) return;
    let melhor = 0;
    dados.pontos.forEach((p, i) => {
      if (Math.abs(p.x - xToque) < Math.abs(dados.pontos[melhor].x - xToque)) melhor = i;
    });
    setSelecionado(melhor);
  };
  const aoTocar = (e) => selecionarPerto(e.nativeEvent.locationX);
  const aoPonteiro = (e) => {
    const caixa = areaRef.current?.getBoundingClientRect?.();
    if (caixa) selecionarPerto(e.nativeEvent.clientX - caixa.left);
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

  const ponto = selecionado != null && dados ? dados.pontos[selecionado] : null;
  const dicaX = ponto ? Math.min(Math.max(ponto.x - LARGURA_DICA / 2, 0), largura - LARGURA_DICA) : 0;
  const dicaAcima = ponto && ponto.yDia > ALTURA / 2;
  const muitosPontos = medicoes.length > 50;

  return (
    <View style={styles.grafico}>
      <View
        ref={areaRef}
        onLayout={(e) => setLargura(e.nativeEvent.layout.width)}
        style={{ height: ALTURA, touchAction: "pan-y" }}
        {...interacao}
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Gráfico de pressão arterial dos últimos ${dias} dias com ${medicoes.length} medições`}
      >
        {largura > 0 && dados && (
          <Svg width={largura} height={ALTURA} pointerEvents="none">
            {dados.marcasY.map((m) => (
              <G key={`y${m.valor}`}>
                <Line x1={area.x} x2={area.x + area.largura} y1={m.y} y2={m.y} stroke={color.borda} strokeWidth={1} />
                <SvgText x={area.x - 6} y={m.y + 4} fontSize={10} fontFamily={FONTE} fill={color.textoSuave} textAnchor="end">
                  {m.valor}
                </SvgText>
              </G>
            ))}
            <SvgText x={4} y={MARGEM.topo - 4} fontSize={9} fontFamily={FONTE} fill={color.textoSuave}>
              mmHg
            </SvgText>
            {dados.marcasX.map((m, i) => (
              <SvgText
                key={`x${i}`}
                x={m.x}
                y={ALTURA - 8}
                fontSize={10}
                fontFamily={FONTE}
                fill={color.textoSuave}
                textAnchor={i === 0 ? "start" : i === dados.marcasX.length - 1 ? "end" : "middle"}
              >
                {m.texto}
              </SvgText>
            ))}

            {[dados.yMetaSis, dados.yMetaDia].map(
              (yMeta, i) =>
                yMeta != null && (
                  <Line
                    key={`meta${i}`}
                    x1={area.x}
                    x2={area.x + area.largura}
                    y1={yMeta}
                    y2={yMeta}
                    stroke={color.vermelho}
                    strokeOpacity={0.6}
                    strokeDasharray="2 4"
                    strokeWidth={1.5}
                  />
                )
            )}

            <Path d={dados.caminhoSis} stroke={CORES_PRESSAO.sistolica} strokeWidth={2.5} fill="none" strokeLinejoin="round" />
            <Path
              d={dados.caminhoDia}
              stroke={CORES_PRESSAO.diastolica}
              strokeWidth={2.5}
              strokeDasharray="6 4"
              fill="none"
              strokeLinejoin="round"
            />
            {dados.pontos.map((p, i) => {
              const ativo = i === selecionado;
              const r = ativo ? 6 : muitosPontos ? 2.5 : 3.5;
              return (
                <G key={p.medicao.id}>
                  <Circle cx={p.x} cy={p.ySis} r={r} fill={CORES_PRESSAO.sistolica} stroke={color.branco} strokeWidth={ativo ? 2 : 1} />
                  <Rect
                    x={p.x - r}
                    y={p.yDia - r}
                    width={r * 2}
                    height={r * 2}
                    fill={CORES_PRESSAO.diastolica}
                    stroke={color.branco}
                    strokeWidth={ativo ? 2 : 1}
                  />
                </G>
              );
            })}
            {ponto && (
              <Line
                x1={ponto.x}
                x2={ponto.x}
                y1={area.y}
                y2={area.y + area.altura}
                stroke={color.textoSuave}
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            )}
            <Rect x={area.x} y={area.y} width={area.largura} height={area.altura} fill="none" stroke={color.borda} strokeWidth={1} />
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
            <Text style={styles.dicaValor}>
              {ponto.medicao.sistolica}/{ponto.medicao.diastolica} mmHg
            </Text>
            <Text style={styles.dicaTexto}>
              Sistólica {ponto.medicao.sistolica} · Diastólica {ponto.medicao.diastolica}
            </Text>
            {!!formatarFrequencia(ponto.medicao) && (
              <Text style={styles.dicaTexto}>FC {formatarFrequencia(ponto.medicao)}</Text>
            )}
            <Text style={styles.dicaTexto}>
              {formatarData(ponto.medicao.data)} às {ponto.medicao.hora}
            </Text>
            <Text style={styles.dicaTexto}>{rotuloContexto(ponto.medicao.contexto)}</Text>
          </View>
        )}
      </View>
      <LegendaPressao comMetas={metaSis != null || metaDia != null} />
      <Text style={[styles.legenda, { marginTop: 6 }]}>
        {ponto ? "Arraste para ver outras medições." : "Toque no gráfico para ver os valores exatos de cada medição."}
      </Text>
    </View>
  );
};
