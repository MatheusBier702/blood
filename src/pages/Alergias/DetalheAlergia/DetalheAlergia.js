import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/AlergiasStyle";
import { GlobalContextAlergias } from "../GlobalContextAlergias";
import {
  Botao,
  CampoDetalhe,
  Chip,
  Confirmacao,
  EtiquetaGravidade,
  Secao,
  Vazio,
} from "../Componentes/Componentes";
import {
  formatarData,
  rotuloCategoria,
  rotuloGravidade,
  rotuloSituacao,
  rotuloTipoDocumento,
} from "../dadosAlergias";

export const DetalheAlergia = ({ navigation, route }) => {
  const { buscarAlergia, reacoes, documentos, removerAlergia } = React.useContext(GlobalContextAlergias);
  const [confirmando, setConfirmando] = React.useState(false);

  const alergia = buscarAlergia(route.params?.id);

  if (!alergia) {
    return (
      <View style={styles.container}>
        <Header titulo="Detalhes" voltar />
        <View style={styles.scroll}>
          <View style={styles.conteudo}>
            <Vazio
              texto="Esta alergia não foi encontrada. Ela pode ter sido excluída."
              rotuloAcao="Voltar"
              acao={() => navigation.goBack()}
            />
          </View>
        </View>
      </View>
    );
  }

  const reacoesDela = reacoes.filter((item) => item.alergiaId === alergia.id);
  const documentosDela = documentos.filter((item) => item.alergiaId === alergia.id);

  const excluir = async () => {
    setConfirmando(false);
    const ok = await removerAlergia(alergia.id);
    if (ok) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header titulo="Detalhes" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>{rotuloCategoria(alergia.categoria).toUpperCase()}</Text>
          <Text style={styles.titulo}>{alergia.substancia}</Text>
          <View style={styles.cardInfo}>
            <EtiquetaGravidade gravidade={alergia.gravidade} />
            <Chip texto={rotuloSituacao(alergia.situacao)} />
          </View>

          <View style={styles.painel}>
            <CampoDetalhe rotulo="Substância" valor={alergia.substancia} />
            <CampoDetalhe rotulo="Categoria" valor={rotuloCategoria(alergia.categoria)} />
            <CampoDetalhe rotulo="Sintomas" valor={alergia.sintomas} />
            <CampoDetalhe rotulo="Gravidade" valor={rotuloGravidade(alergia.gravidade)} />
            <CampoDetalhe rotulo="Data da última reação" valor={formatarData(alergia.ultimaReacao)} />
            <CampoDetalhe rotulo="Situação" valor={rotuloSituacao(alergia.situacao)} />
            <CampoDetalhe rotulo="Observações" valor={alergia.observacoes} ultimo />
          </View>

          <View style={[styles.botoesLinha, { marginTop: 4 }]}>
            <Botao
              texto="Editar"
              style={styles.botaoMetade}
              onPress={() => navigation.navigate("CadastroAlergia", { id: alergia.id })}
            />
            <Botao
              texto="Registrar reação"
              variante="secundario"
              style={[styles.botaoMetade, { marginTop: 22 }]}
              onPress={() => navigation.navigate("HistoricoReacoes", { novaPara: alergia.id })}
            />
          </View>

          <Secao
            titulo="Reações registradas"
            rotuloAcao="Histórico"
            acao={() => navigation.navigate("HistoricoReacoes")}
          />
          {reacoesDela.length === 0 ? (
            <Vazio texto="Nenhuma reação registrada para esta alergia." />
          ) : (
            reacoesDela.map((reacao) => (
              <View key={reacao.id} style={styles.card}>
                <View style={styles.cardCorpo}>
                  <Text style={styles.cardNome}>{formatarData(reacao.data)}</Text>
                  <Text style={styles.cardTexto}>{reacao.sintomas}</Text>
                  <View style={styles.cardInfo}>
                    <EtiquetaGravidade gravidade={reacao.gravidade} />
                  </View>
                </View>
              </View>
            ))
          )}

          <Secao
            titulo="Documentos"
            rotuloAcao="Anexar"
            acao={() => navigation.navigate("DocumentosAlergias", { novoPara: alergia.id })}
          />
          {documentosDela.length === 0 ? (
            <Vazio texto="Nenhum exame ou laudo vinculado a esta alergia." />
          ) : (
            documentosDela.map((documento) => (
              <View key={documento.id} style={styles.card}>
                <View style={styles.cardCorpo}>
                  <Text style={styles.cardNome}>{documento.titulo}</Text>
                  <Text style={styles.cardTexto}>
                    {rotuloTipoDocumento(documento.tipo)} · {formatarData(documento.data)}
                  </Text>
                </View>
              </View>
            ))
          )}

          <Botao texto="Excluir alergia" variante="perigo" onPress={() => setConfirmando(true)} />
        </View>
      </ScrollView>

      <Confirmacao
        visivel={confirmando}
        titulo="Excluir alergia?"
        texto={`"${alergia.substancia}" será removida da sua lista. As reações e os documentos continuam no histórico.`}
        onConfirmar={excluir}
        onCancelar={() => setConfirmando(false)}
      />
    </View>
  );
};
