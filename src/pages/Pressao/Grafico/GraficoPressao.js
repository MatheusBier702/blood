import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/PressaoStyle";
import { GlobalContextPressao } from "../GlobalContextPressao";
import { Botao, SeletorOpcoes } from "../../Alergias/Componentes/Componentes";
import { GraficoLinhasPressao } from "./GraficoLinhasPressao";
import { CONTEXTOS, PERIODOS, estatisticasPressao, filtrarPeriodo, mediaFormatada } from "../dadosPressao";

export const GraficoPressao = ({ navigation }) => {
  const { medicoes, metas, periodo, setPeriodo } = React.useContext(GlobalContextPressao);
  const [contexto, setContexto] = React.useState("todos");

  const lista = React.useMemo(
    () => filtrarPeriodo(medicoes, periodo).filter((m) => contexto === "todos" || m.contexto === contexto),
    [medicoes, periodo, contexto]
  );
  const resumo = estatisticasPressao(lista);
  const media = mediaFormatada(resumo);

  return (
    <View style={styles.container}>
      <Header titulo="Gráficos" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>EVOLUÇÃO</Text>
          <Text style={styles.titulo}>Sua pressão ao longo do tempo</Text>
          <Text style={styles.subtitulo}>Valores em mmHg. Escolha o período e o contexto das medições.</Text>

          <SeletorOpcoes rotulo="Período" opcoes={PERIODOS} valor={periodo} onChange={setPeriodo} />
          <SeletorOpcoes
            rotulo="Contexto"
            opcoes={[{ valor: "todos", rotulo: "Todos" }, ...CONTEXTOS]}
            valor={contexto}
            onChange={setContexto}
          />

          <GraficoLinhasPressao medicoes={lista} dias={periodo} metas={metas} />

          <View style={styles.resumo}>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoValor}>{media ?? "—"}</Text>
              <Text style={styles.resumoRotulo}>média (mmHg)</Text>
            </View>
            <View style={styles.resumoItem}>
              <Text style={styles.resumoValor}>{resumo.quantidade}</Text>
              <Text style={styles.resumoRotulo}>{resumo.quantidade === 1 ? "medição" : "medições"}</Text>
            </View>
          </View>
          {resumo.quantidade > 0 && (
            <Text style={[styles.legenda, { marginTop: 8 }]}>
              Sistólica de {resumo.sistolica.menor} a {resumo.sistolica.maior} mmHg · diastólica de {resumo.diastolica.menor} a{" "}
              {resumo.diastolica.maior} mmHg nos últimos {periodo} dias.
            </Text>
          )}

          <Botao texto="Ver relatório completo" onPress={() => navigation.navigate("RelatorioPressao")} />
          <Botao texto="+ Registrar pressão" variante="secundario" onPress={() => navigation.navigate("RegistrarPressao")} />
        </View>
      </ScrollView>
    </View>
  );
};
