import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/GlicemiaStyle";
import { GlobalContextGlicemia } from "../GlobalContextGlicemia";
import { EtiquetaMeta } from "../CardMedicao/CardMedicao";
import { Aviso, Botao, CampoDetalhe, Confirmacao, Vazio } from "../../Alergias/Componentes/Componentes";
import { compararComMeta, descreverMeta, formatarDataHora, rotuloMomento } from "../dadosGlicemia";

export const DetalheMedicao = ({ navigation, route }) => {
  const { buscarMedicao, removerMedicao, metas } = React.useContext(GlobalContextGlicemia);
  const medicao = buscarMedicao(route.params?.id);
  const [excluindo, setExcluindo] = React.useState(false);

  if (!medicao) {
    return (
      <View style={styles.container}>
        <Header titulo="Medição" voltar />
        <View style={[styles.scroll, styles.conteudo]}>
          <Vazio texto="Essa medição não existe mais." rotuloAcao="Voltar" acao={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  const meta = metas[medicao.momento];
  const situacao = compararComMeta(medicao, metas);

  const excluir = async () => {
    setExcluindo(false);
    const ok = await removerMedicao(medicao.id);
    if (ok) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header titulo="Medição" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          {route.params?.nova && <Aviso texto="Medição registrada com sucesso." />}

          <View style={styles.ultima}>
            <Text style={styles.ultimaRotulo}>{rotuloMomento(medicao.momento).toUpperCase()}</Text>
            <View style={styles.ultimaValorLinha}>
              <Text style={styles.ultimaValor}>{medicao.valor}</Text>
              <Text style={styles.ultimaUnidade}>mg/dL</Text>
            </View>
            <Text style={styles.ultimaTexto}>{formatarDataHora(medicao)}</Text>
            {!!situacao && (
              <View style={styles.ultimaChips}>
                <EtiquetaMeta medicao={medicao} metas={metas} />
              </View>
            )}
          </View>

          <View style={styles.painel}>
            <CampoDetalhe rotulo="Valor" valor={`${medicao.valor} mg/dL`} />
            <CampoDetalhe rotulo="Data e horário" valor={formatarDataHora(medicao)} />
            <CampoDetalhe rotulo="Momento da medição" valor={rotuloMomento(medicao.momento)} />
            <CampoDetalhe
              rotulo="Sua meta para esse momento"
              valor={medicao.momento === "outro" ? "Não se aplica" : descreverMeta(meta)}
            />
            <CampoDetalhe rotulo="Observações" valor={medicao.observacoes} ultimo />
          </View>

          {medicao.momento !== "outro" && !situacao && (
            <Text style={[styles.legenda, { marginTop: 10 }]}>
              Cadastre suas metas, definidas com sua equipe de saúde, para comparar cada medição com elas.
            </Text>
          )}

          <Botao texto="Editar medição" onPress={() => navigation.navigate("RegistrarGlicemia", { id: medicao.id })} />
          {medicao.momento !== "outro" && !situacao && (
            <Botao texto="Definir metas" variante="secundario" onPress={() => navigation.navigate("MetasGlicemia")} />
          )}
          <Botao texto="Excluir medição" variante="perigo" onPress={() => setExcluindo(true)} />
        </View>
      </ScrollView>

      <Confirmacao
        visivel={excluindo}
        titulo="Excluir medição?"
        texto={`A medição de ${medicao.valor} mg/dL de ${formatarDataHora(medicao)} será apagada.`}
        onConfirmar={excluir}
        onCancelar={() => setExcluindo(false)}
      />
    </View>
  );
};
