import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/GlicemiaStyle";
import { GlobalContextGlicemia } from "../GlobalContextGlicemia";
import { Botao, SeletorOpcoes } from "../../Alergias/Componentes/Componentes";
import { GraficoLinha } from "./GraficoLinha";
import { MOMENTOS, PERIODOS, estatisticas, filtrarPeriodo, formatarDataHora } from "../dadosGlicemia";

export const GraficoGlicemia = ({ navigation }) => {
  const { medicoes, periodo, setPeriodo } = React.useContext(GlobalContextGlicemia);
  const [momento, setMomento] = React.useState("todos");

  const doPeriodo = React.useMemo(() => filtrarPeriodo(medicoes, periodo), [medicoes, periodo]);
  const lista = React.useMemo(
    () => doPeriodo.filter((item) => momento === "todos" || item.momento === momento),
    [doPeriodo, momento]
  );
  const resumo = estatisticas(lista);

  return (
    <View style={styles.container}>
      <Header titulo="Gráficos" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>EVOLUÇÃO</Text>
          <Text style={styles.titulo}>Sua glicemia ao longo do tempo</Text>
          <Text style={styles.subtitulo}>Valores em mg/dL. Escolha o período e o momento da medição.</Text>

          <SeletorOpcoes rotulo="Período" opcoes={PERIODOS} valor={periodo} onChange={setPeriodo} />
          <SeletorOpcoes
            rotulo="Momento"
            opcoes={[{ valor: "todos", rotulo: "Todos" }, ...MOMENTOS]}
            valor={momento}
            onChange={setMomento}
          />

          <GraficoLinha medicoes={lista} dias={periodo} />

          <View style={styles.resumo}>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoValor}>{resumo.media != null ? Math.round(resumo.media) : "—"}</Text>
              <Text style={styles.resumoRotulo}>média</Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoValor}>{resumo.menor?.valor ?? "—"}</Text>
              <Text style={styles.resumoRotulo}>menor</Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoValor}>{resumo.maior?.valor ?? "—"}</Text>
              <Text style={styles.resumoRotulo}>maior</Text>
            </View>
          </View>
          {resumo.quantidade > 0 && (
            <Text style={[styles.legenda, { marginTop: 8 }]}>
              {resumo.quantidade} {resumo.quantidade === 1 ? "medição" : "medições"} nos últimos {periodo} dias. Menor em{" "}
              {formatarDataHora(resumo.menor)}; maior em {formatarDataHora(resumo.maior)}.
            </Text>
          )}

          <Botao texto="Ver relatório completo" onPress={() => navigation.navigate("RelatorioGlicemia")} />
          <Botao
            texto="+ Registrar glicemia"
            variante="secundario"
            onPress={() => navigation.navigate("RegistrarGlicemia")}
          />
        </View>
      </ScrollView>
    </View>
  );
};
