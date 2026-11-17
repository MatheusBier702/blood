import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/PressaoStyle";
import { GlobalContextPressao } from "../GlobalContextPressao";
import { CardPressao, EtiquetaAlerta, OrientacaoEmergencia } from "../CardPressao/CardPressao";
import { Aviso, Botao, Secao, SeletorOpcoes, Vazio } from "../../Alergias/Componentes/Componentes";
import {
  MINIMO_PARA_MEDIA,
  PERIODOS,
  TIPOS_ALERTA,
  alertaDaMedicao,
  estatisticasPressao,
  filtrarPeriodo,
  formatarDataHora,
  formatarFrequencia,
  formatarPressao,
  mediaFormatada,
  rotuloBraco,
  rotuloContexto,
  temMetas,
} from "../dadosPressao";

const LIMITE_RECENTES = 4;

export const VisaoGeral = ({ navigation }) => {
  const { medicoes, metas, periodo, setPeriodo, carregando, erro, recarregar, alertasPendentes, alertaMaisGrave } =
    React.useContext(GlobalContextPressao);

  const doPeriodo = React.useMemo(() => filtrarPeriodo(medicoes, periodo), [medicoes, periodo]);
  const resumo = estatisticasPressao(doPeriodo);
  const media = mediaFormatada(resumo);
  const ultima = medicoes[0];
  const alertaUltima = ultima ? alertaDaMedicao(ultima, metas) : null;
  const abrirDetalhe = (medicao) => navigation.navigate("DetalhePressao", { id: medicao.id });

  const atalhos = [
    { rota: "HistoricoPressao", titulo: "Histórico", texto: "Todas as medições, por data.", total: medicoes.length },
    { rota: "GraficoPressao", titulo: "Gráficos", texto: "Sistólica e diastólica em 7, 30 ou 90 dias.", total: doPeriodo.length },
    { rota: "RelatorioPressao", titulo: "Relatórios", texto: "Médias, maiores e menores valores. Exporte em PDF.", total: resumo.quantidade },
    { rota: "AlertasPressao", titulo: "Alertas", texto: "Medições que merecem atenção.", total: alertasPendentes.length },
    { rota: "MetasPressao", titulo: "Metas", texto: "Definidas pelo seu profissional de saúde.", total: temMetas(metas) ? 1 : 0 },
  ];

  return (
    <View style={styles.container}>
      <Header titulo="Pressão" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>VISÃO GERAL</Text>
          <Text style={styles.titulo}>Acompanhe sua pressão arterial</Text>
          <Text style={styles.subtitulo}>
            Registre suas medições e leve o histórico para as consultas com sua equipe de saúde.
          </Text>

          {!!erro && <Aviso erro texto={erro} acao={recarregar} rotuloAcao="Tentar de novo" />}

          {carregando ? (
            <View style={{ paddingVertical: 24 }}>
              <ActivityIndicator color={color.colorModelFour} />
            </View>
          ) : (
            <>
              {alertaMaisGrave?.tipo === "urgente" && <OrientacaoEmergencia />}
              {!!alertaMaisGrave && (
                <Aviso
                  erro
                  texto={`${
                    alertasPendentes.length === 1
                      ? "1 medição merece atenção"
                      : `${alertasPendentes.length} medições merecem atenção`
                  }. A principal: ${formatarPressao(alertaMaisGrave.medicao)} mmHg (${TIPOS_ALERTA[
                    alertaMaisGrave.tipo
                  ].rotulo.toLowerCase()}) em ${formatarDataHora(alertaMaisGrave.medicao)}.`}
                  acao={() => navigation.navigate("AlertasPressao")}
                  rotuloAcao="Ver alertas"
                />
              )}

              {ultima ? (
                <Pressable
                  onPress={() => abrirDetalhe(ultima)}
                  accessibilityRole="button"
                  accessibilityLabel={`Última medição: ${formatarPressao(ultima)} mmHg`}
                  style={({ pressed }) => [styles.ultima, pressed && styles.pressionado]}
                >
                  <Text style={styles.ultimaRotulo}>ÚLTIMA MEDIÇÃO</Text>
                  <View style={styles.ultimaValorLinha}>
                    <Text style={styles.ultimaValor}>{formatarPressao(ultima)}</Text>
                    <Text style={styles.ultimaUnidade}>mmHg</Text>
                  </View>
                  <Text style={styles.ultimaTexto}>
                    Sistólica (máxima) {ultima.sistolica} · Diastólica (mínima) {ultima.diastolica}
                  </Text>
                  <Text style={styles.ultimaTexto}>{formatarDataHora(ultima)}</Text>
                  <View style={styles.ultimaChips}>
                    {!!formatarFrequencia(ultima) && (
                      <View style={styles.ultimaChip}>
                        <Text style={styles.ultimaChipTexto}>FC {formatarFrequencia(ultima)}</Text>
                      </View>
                    )}
                    <View style={styles.ultimaChip}>
                      <Text style={styles.ultimaChipTexto}>{rotuloContexto(ultima.contexto)}</Text>
                    </View>
                    <View style={styles.ultimaChip}>
                      <Text style={styles.ultimaChipTexto}>Braço {rotuloBraco(ultima.braco).toLowerCase()}</Text>
                    </View>
                    {!!alertaUltima && <EtiquetaAlerta tipo={alertaUltima} />}
                  </View>
                </Pressable>
              ) : (
                <View style={{ marginTop: 18 }}>
                  <Vazio
                    texto="Você ainda não registrou nenhuma medição."
                    rotuloAcao="Registrar agora"
                    acao={() => navigation.navigate("RegistrarPressao")}
                  />
                </View>
              )}

              <Botao texto="+ Registrar pressão" onPress={() => navigation.navigate("RegistrarPressao")} />

              <Secao titulo="Resumo do período" />
              <SeletorOpcoes opcoes={PERIODOS} valor={periodo} onChange={setPeriodo} />
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
              <Text style={[styles.legenda, { marginTop: 8 }]}>
                Últimos {periodo} dias, contando hoje.
                {resumo.quantidade < MINIMO_PARA_MEDIA
                  ? ` A média aparece a partir de ${MINIMO_PARA_MEDIA} medições.`
                  : resumo.frequencia.quantidade
                    ? ` Frequência cardíaca média: ${Math.round(resumo.frequencia.media)} bpm (${resumo.frequencia.quantidade} com FC informada).`
                    : ""}
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
                acao={medicoes.length > LIMITE_RECENTES ? () => navigation.navigate("HistoricoPressao") : undefined}
              />
              {medicoes.length === 0 ? (
                <Vazio texto="Suas medições mais recentes aparecerão aqui." />
              ) : (
                medicoes
                  .slice(0, LIMITE_RECENTES)
                  .map((medicao) => (
                    <CardPressao key={medicao.id} medicao={medicao} metas={metas} onPress={abrirDetalhe} />
                  ))
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
