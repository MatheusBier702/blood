import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/VacinasStyle";
import { GlobalContextVacinas } from "../GlobalContextVacinas";
import { EtiquetaSituacao, textoProxima } from "../CardVacina/CardVacina";
import { Aviso, Botao, CampoDetalhe, Chip, Link, Secao, Vazio } from "../../Alergias/Componentes/Componentes";
import { FAIXAS, VACINAS, buscarRecomendacao } from "../calendarioVacinas";
import { SITUACOES, dataParaIso } from "../situacaoVacinas";
import { formatarData } from "../../Alergias/dadosAlergias";

const SITUACAO_DOSE = {
  aplicada: SITUACOES.aplicada,
  pendente: SITUACOES.pendente,
  atrasada: SITUACOES.atrasada,
  encerrada: { rotulo: "Prazo encerrado", fundo: SITUACOES.nao_iniciada.fundo, texto: SITUACOES.nao_iniciada.texto },
};

export const DetalheVacina = ({ navigation, route }) => {
  const { situacoes, aplicacoes } = React.useContext(GlobalContextVacinas);
  const recomendacao = buscarRecomendacao(route.params?.id);

  if (!recomendacao) {
    return (
      <View style={styles.container}>
        <Header titulo="Vacina" voltar />
        <View style={[styles.scroll, styles.conteudo]}>
          <Vazio texto="Vacina não encontrada." rotuloAcao="Voltar" acao={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  const vacina = VACINAS[recomendacao.vacina];
  const calculo = situacoes[recomendacao.id];
  const historico = aplicacoes.filter((a) => recomendacao.regra.chaves.includes(a.vacina));
  const faixa = FAIXAS.find((f) => f.valor === recomendacao.faixa);
  const proxima = textoProxima(calculo);
  const especialSemRegistro = recomendacao.tipo === "especial" && calculo.situacao === "nao_iniciada";

  return (
    <View style={styles.container}>
      <Header titulo="Vacina" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>
            {faixa.rotulo.toUpperCase()} · {recomendacao.tipo === "rotina" ? "ROTINA" : "RECOMENDAÇÃO ESPECIAL"}
          </Text>
          <Text style={styles.titulo}>{vacina.nome}</Text>
          <Text style={styles.subtitulo}>Previne: {vacina.doencas}</Text>
          <View style={styles.cardInfo}>
            {especialSemRegistro ? <Chip texto="Indicação específica" /> : <EtiquetaSituacao situacao={calculo.situacao} />}
            {!!proxima && <Chip texto={proxima} />}
          </View>

          {recomendacao.tipo === "especial" && (
            <View style={styles.especial}>
              <Text style={styles.especialTexto}>Indicada para: {recomendacao.grupo}</Text>
            </View>
          )}
          {calculo.situacao === "atrasada" && (
            <Aviso erro texto="Há dose em atraso. Procure uma unidade de saúde com a caderneta para atualizar a vacinação." />
          )}
          {!!calculo.nota && <Aviso texto={calculo.nota} />}

          <View style={styles.painel}>
            <CampoDetalhe rotulo="Idade recomendada" valor={recomendacao.idade} />
            <CampoDetalhe rotulo="Quantidade de doses" valor={recomendacao.doses} />
            <CampoDetalhe rotulo="Intervalo entre as doses" valor={recomendacao.intervalo || "Não se aplica"} />
            <CampoDetalhe rotulo="Reforços" valor={recomendacao.reforco || "Conforme orientação da unidade de saúde"} />
            <CampoDetalhe rotulo="Última aplicação" valor={calculo.ultima ? formatarData(calculo.ultima.data) : "Nenhuma registrada"} />
            <CampoDetalhe
              rotulo="Próxima data prevista"
              valor={calculo.proximaData ? (calculo.proximaAtrasada ? "O quanto antes (em atraso)" : formatarData(dataParaIso(calculo.proximaData))) : "Não se aplica"}
            />
            <CampoDetalhe rotulo="Observações" valor={recomendacao.observacao || "—"} ultimo />
          </View>

          {!!calculo.doses && (
            <>
              <Secao titulo="Doses do esquema" />
              <View style={styles.painel}>
                {calculo.doses.map((dose, i) => {
                  const info = SITUACAO_DOSE[dose.situacao];
                  return (
                    <View key={dose.rotulo} style={[styles.dose, i === calculo.doses.length - 1 && styles.doseUltima]}>
                      <View style={[styles.dosePonto, { backgroundColor: info.texto }]} />
                      <View style={styles.doseCorpo}>
                        <Text style={styles.doseNome}>{dose.rotulo}</Text>
                        <Text style={styles.legenda}>
                          {dose.registro
                            ? `Aplicada em ${formatarData(dose.registro.data)}`
                            : `Prevista para ${formatarData(dataParaIso(dose.prevista))}`}
                        </Text>
                      </View>
                      <View style={[styles.chip, { backgroundColor: info.fundo }]}>
                        <Text style={[styles.chipTexto, { color: info.texto }]}>{info.rotulo}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          <Secao titulo="Histórico desta vacina" />
          {historico.length === 0 ? (
            <Vazio texto="Nenhuma aplicação registrada." />
          ) : (
            historico.map((a) => (
              <View key={a.id} style={styles.card}>
                <View style={styles.cardCorpo}>
                  <Text style={styles.cardNome}>
                    {VACINAS[a.vacina]?.nome} · {a.dose || "Dose"}
                  </Text>
                  <Text style={styles.legenda}>
                    {formatarData(a.data)}
                    {a.local ? ` · ${a.local}` : ""}
                    {a.lote ? ` · lote ${a.lote}` : ""}
                  </Text>
                  <View style={styles.cardAcoes}>
                    <Link texto="Editar" onPress={() => navigation.navigate("RegistrarAplicacao", { id: a.id })} />
                  </View>
                </View>
              </View>
            ))
          )}

          <Botao
            texto="+ Registrar aplicação"
            onPress={() => navigation.navigate("RegistrarAplicacao", { vacina: recomendacao.vacina })}
          />
        </View>
      </ScrollView>
    </View>
  );
};
