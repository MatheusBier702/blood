import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/AlergiasStyle";
import { GlobalContextAlergias } from "../GlobalContextAlergias";
import { CardAlergia } from "../CardAlergia/CardAlergia";
import { Aviso, Botao, Secao, Vazio } from "../Componentes/Componentes";

const LIMITE_RESUMO = 3;

export const VisaoGeral = ({ navigation }) => {
  const { alergias, graves, reacoes, documentos, carregando, erro, recarregar } =
    React.useContext(GlobalContextAlergias);

  const abrirDetalhe = (alergia) => navigation.navigate("DetalheAlergia", { id: alergia.id });

  const atalhos = [
    {
      rota: "MinhasAlergias",
      titulo: "Minhas alergias",
      texto: "Veja todas, separadas por categoria.",
      total: alergias.length,
    },
    {
      rota: "HistoricoReacoes",
      titulo: "Histórico de reações",
      texto: "Episódios com data, sintomas e gravidade.",
      total: reacoes.length,
    },
    {
      rota: "DocumentosAlergias",
      titulo: "Documentos e exames",
      texto: "Anexe e consulte exames e laudos.",
      total: documentos.length,
    },
    {
      rota: "AlertasAlergias",
      titulo: "Alertas",
      texto: "Resumo rápido para profissionais de saúde.",
      total: graves.length,
    },
  ];

  return (
    <View style={styles.container}>
      <Header titulo="Alergias" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>VISÃO GERAL</Text>
          <Text style={styles.titulo}>Suas alergias em um só lugar</Text>
          <Text style={styles.subtitulo}>
            Registre o que causa reação em você e tenha as informações prontas para mostrar em consultas e
            emergências.
          </Text>

          {!!erro && <Aviso erro texto={erro} acao={recarregar} rotuloAcao="Tentar de novo" />}

          {carregando ? (
            <View style={{ paddingVertical: 24 }}>
              <ActivityIndicator color={color.colorModelFour} />
            </View>
          ) : (
            <>
              <View style={styles.resumo}>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoValor}>{alergias.length}</Text>
                  <Text style={styles.resumoRotulo}>
                    {alergias.length === 1 ? "alergia cadastrada" : "alergias cadastradas"}
                  </Text>
                </View>
                <View style={[styles.resumoItem, graves.length > 0 && styles.resumoItemGrave]}>
                  <Text style={[styles.resumoValor, graves.length > 0 && styles.resumoValorGrave]}>
                    {graves.length}
                  </Text>
                  <Text style={styles.resumoRotulo}>{graves.length === 1 ? "grave" : "graves"}</Text>
                </View>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoValor}>{reacoes.length}</Text>
                  <Text style={styles.resumoRotulo}>{reacoes.length === 1 ? "reação" : "reações"}</Text>
                </View>
              </View>

              {graves.length > 0 && (
                <View style={styles.destaque}>
                  <Text style={styles.destaqueTitulo}>Atenção: alergias graves</Text>
                  <Text style={styles.destaqueValor}>{graves.map((item) => item.substancia).join(", ")}</Text>
                  <Text style={styles.destaqueTexto}>
                    Informe sempre a equipe de saúde antes de qualquer medicamento ou procedimento.
                  </Text>
                  <View style={styles.destaqueAcoes}>
                    <Pressable
                      onPress={() => navigation.navigate("AlertasAlergias")}
                      accessibilityRole="button"
                      style={({ pressed }) => [styles.destaqueBotao, pressed && styles.pressionado]}
                    >
                      <Text style={styles.destaqueBotaoTexto}>Abrir alertas</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              <Botao texto="+ Cadastrar alergia" onPress={() => navigation.navigate("CadastroAlergia")} />

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
                titulo="Resumo"
                rotuloAcao={alergias.length > LIMITE_RESUMO ? "Ver todas" : undefined}
                acao={alergias.length > LIMITE_RESUMO ? () => navigation.navigate("MinhasAlergias") : undefined}
              />
              {alergias.length === 0 ? (
                <Vazio
                  texto="Você ainda não cadastrou nenhuma alergia."
                  rotuloAcao="Cadastrar agora"
                  acao={() => navigation.navigate("CadastroAlergia")}
                />
              ) : (
                alergias
                  .slice(0, LIMITE_RESUMO)
                  .map((alergia) => <CardAlergia key={alergia.id} alergia={alergia} onPress={abrirDetalhe} />)
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
