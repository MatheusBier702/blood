import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/GlicemiaStyle";
import { GlobalContextGlicemia } from "../GlobalContextGlicemia";
import { CardMedicao, EtiquetaMeta } from "../CardMedicao/CardMedicao";
import { Aviso, Botao, Secao, SeletorOpcoes, Vazio } from "../../Alergias/Componentes/Componentes";
import {
  MOMENTOS_COM_META,
  PERIODOS,
  estatisticas,
  filtrarPeriodo,
  formatarDataHora,
  rotuloMomento,
  temMeta,
} from "../dadosGlicemia";

const LIMITE_RECENTES = 4;

export const VisaoGeral = ({ navigation }) => {
  const { medicoes, metas, periodo, setPeriodo, carregando, erro, recarregar } =
    React.useContext(GlobalContextGlicemia);

  const doPeriodo = React.useMemo(() => filtrarPeriodo(medicoes, periodo), [medicoes, periodo]);
  const resumo = estatisticas(doPeriodo);
  const ultima = medicoes[0];
  const metasDefinidas = MOMENTOS_COM_META.filter((m) => temMeta(metas[m.valor])).length;
  const abrirDetalhe = (medicao) => navigation.navigate("DetalheMedicao", { id: medicao.id });

  const atalhos = [
    { rota: "HistoricoGlicemia", titulo: "Histórico", texto: "Todas as medições, por data.", total: medicoes.length },
    { rota: "GraficoGlicemia", titulo: "Gráficos", texto: "Evolução em 7, 30 ou 90 dias.", total: doPeriodo.length },
    { rota: "RelatorioGlicemia", titulo: "Relatórios", texto: "Média, menor e maior valor. Exporte em PDF.", total: resumo.quantidade },
    { rota: "MetasGlicemia", titulo: "Metas", texto: "Suas metas individuais por momento.", total: metasDefinidas },
  ];

  return (
    <View style={styles.container}>
      <Header titulo="Glicemia" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>VISÃO GERAL</Text>
          <Text style={styles.titulo}>Acompanhe sua glicemia</Text>
          <Text style={styles.subtitulo}>
            Registre suas medições e acompanhe a evolução para conversar com sua equipe de saúde.
          </Text>

          {!!erro && <Aviso erro texto={erro} acao={recarregar} rotuloAcao="Tentar de novo" />}

          {carregando ? (
            <View style={{ paddingVertical: 24 }}>
              <ActivityIndicator color={color.colorModelFour} />
            </View>
          ) : (
            <>
              {ultima ? (
                <Pressable
                  onPress={() => abrirDetalhe(ultima)}
                  accessibilityRole="button"
                  accessibilityLabel={`Última medição: ${ultima.valor} mg/dL`}
                  style={({ pressed }) => [styles.ultima, pressed && styles.pressionado]}
                >
                  <Text style={styles.ultimaRotulo}>ÚLTIMA MEDIÇÃO</Text>
                  <View style={styles.ultimaValorLinha}>
                    <Text style={styles.ultimaValor}>{ultima.valor}</Text>
                    <Text style={styles.ultimaUnidade}>mg/dL</Text>
                  </View>
                  <Text style={styles.ultimaTexto}>{formatarDataHora(ultima)}</Text>
                  <View style={styles.ultimaChips}>
                    <View style={styles.ultimaChip}>
                      <Text style={styles.ultimaChipTexto}>{rotuloMomento(ultima.momento)}</Text>
                    </View>
                    <EtiquetaMeta medicao={ultima} metas={metas} />
                  </View>
                </Pressable>
              ) : (
                <View style={{ marginTop: 18 }}>
                  <Vazio
                    texto="Você ainda não registrou nenhuma medição."
                    rotuloAcao="Registrar agora"
                    acao={() => navigation.navigate("RegistrarGlicemia")}
                  />
                </View>
              )}

              <Botao texto="+ Registrar glicemia" onPress={() => navigation.navigate("RegistrarGlicemia")} />

              <Secao titulo="Resumo do período" />
              <SeletorOpcoes opcoes={PERIODOS} valor={periodo} onChange={setPeriodo} />
              <View style={styles.resumo}>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoValor}>{resumo.media != null ? Math.round(resumo.media) : "—"}</Text>
                  <Text style={styles.resumoRotulo}>média (mg/dL)</Text>
                </View>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoValor}>{resumo.quantidade}</Text>
                  <Text style={styles.resumoRotulo}>{resumo.quantidade === 1 ? "medição" : "medições"}</Text>
                </View>
              </View>
              <Text style={[styles.legenda, { marginTop: 8 }]}>
                Últimos {periodo} dias, contando hoje. Total registrado: {medicoes.length}{" "}
                {medicoes.length === 1 ? "medição" : "medições"}.
              </Text>

              <Secao titulo="Acesso rápido" />
              <View style={styles.menu}>
                {atalhos.map((atalho) => (
                  <Pressable
                    key={atalho.rota}
                    onPress={() => navigation.navigate(atalho.rota)}
                    accessibilityRole="button"
                    accessibilityLabel={atalho.titulo}
                    style={({ pressed }) => [styles.menuItem, pressed && styles.pressionado]}
                  >
                    <View style={styles.menuContador}>
                      <Text style={styles.menuContadorTexto}>{atalho.total}</Text>
                    </View>
                    <Text style={styles.menuTitulo}>{atalho.titulo}</Text>
                    <Text style={styles.menuTexto}>{atalho.texto}</Text>
                  </Pressable>
                ))}
              </View>

              <Secao
                titulo="Medições recentes"
                rotuloAcao={medicoes.length > LIMITE_RECENTES ? "Ver todas" : undefined}
                acao={medicoes.length > LIMITE_RECENTES ? () => navigation.navigate("HistoricoGlicemia") : undefined}
              />
              {medicoes.length === 0 ? (
                <Vazio texto="Suas medições mais recentes aparecerão aqui." />
              ) : (
                medicoes
                  .slice(0, LIMITE_RECENTES)
                  .map((medicao) => (
                    <CardMedicao key={medicao.id} medicao={medicao} metas={metas} onPress={abrirDetalhe} />
                  ))
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
