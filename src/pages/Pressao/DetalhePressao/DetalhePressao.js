import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/PressaoStyle";
import { GlobalContextPressao } from "../GlobalContextPressao";
import { EtiquetaAlerta, OrientacaoEmergencia } from "../CardPressao/CardPressao";
import { Aviso, Botao, CampoDetalhe, Confirmacao, Vazio } from "../../Alergias/Componentes/Componentes";
import {
  TIPOS_ALERTA,
  alertaDaMedicao,
  descreverMeta,
  formatarDataHora,
  formatarFrequencia,
  formatarPressao,
  rotuloBraco,
  rotuloContexto,
  rotuloSintoma,
  temMetas,
} from "../dadosPressao";

export const DetalhePressao = ({ navigation, route }) => {
  const { buscarMedicao, removerMedicao, metas } = React.useContext(GlobalContextPressao);
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

  const alerta = alertaDaMedicao(medicao, metas);
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

          {alerta === "urgente" && <OrientacaoEmergencia />}

          <View style={styles.ultima}>
            <Text style={styles.ultimaRotulo}>{rotuloContexto(medicao.contexto).toUpperCase()}</Text>
            <View style={styles.ultimaValorLinha}>
              <Text style={styles.ultimaValor}>{formatarPressao(medicao)}</Text>
              <Text style={styles.ultimaUnidade}>mmHg</Text>
            </View>
            <Text style={styles.ultimaTexto}>{formatarDataHora(medicao)}</Text>
            {!!alerta && (
              <View style={styles.ultimaChips}>
                <EtiquetaAlerta tipo={alerta} />
              </View>
            )}
          </View>

          {!!alerta && alerta !== "urgente" && <Aviso erro={alerta === "muito_elevada"} texto={TIPOS_ALERTA[alerta].orientacao} />}

          <View style={styles.painel}>
            <CampoDetalhe rotulo="Pressão sistólica (máxima)" valor={`${medicao.sistolica} mmHg`} />
            <CampoDetalhe rotulo="Pressão diastólica (mínima)" valor={`${medicao.diastolica} mmHg`} />
            <CampoDetalhe rotulo="Frequência cardíaca" valor={formatarFrequencia(medicao) || "Não informada"} />
            <CampoDetalhe rotulo="Data e horário" valor={formatarDataHora(medicao)} />
            <CampoDetalhe rotulo="Contexto" valor={rotuloContexto(medicao.contexto)} />
            <CampoDetalhe rotulo="Braço utilizado" valor={rotuloBraco(medicao.braco)} />
            <CampoDetalhe
              rotulo="Sintomas"
              valor={(medicao.sintomas || []).length ? medicao.sintomas.map(rotuloSintoma).join(", ") : "Nenhum informado"}
            />
            <CampoDetalhe
              rotulo="Suas metas"
              valor={
                temMetas(metas)
                  ? `Sistólica: ${descreverMeta(metas.sistolica)} · Diastólica: ${descreverMeta(metas.diastolica)}`
                  : "Nenhuma meta cadastrada"
              }
            />
            <CampoDetalhe rotulo="Observações" valor={medicao.observacoes} ultimo />
          </View>

          <Text style={[styles.legenda, { marginTop: 10 }]}>
            Uma medição isolada não é diagnóstico. O acompanhamento depende de várias medições e da avaliação do seu
            profissional de saúde.
          </Text>

          <Botao texto="Editar medição" onPress={() => navigation.navigate("RegistrarPressao", { id: medicao.id })} />
          <Botao texto="Excluir medição" variante="perigo" onPress={() => setExcluindo(true)} />
        </View>
      </ScrollView>

      <Confirmacao
        visivel={excluindo}
        titulo="Excluir medição?"
        texto={`A medição de ${formatarPressao(medicao)} mmHg de ${formatarDataHora(medicao)} será apagada.`}
        onConfirmar={excluir}
        onCancelar={() => setExcluindo(false)}
      />
    </View>
  );
};
