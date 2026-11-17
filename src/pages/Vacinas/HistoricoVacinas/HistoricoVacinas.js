import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/VacinasStyle";
import { GlobalContextVacinas } from "../GlobalContextVacinas";
import { Botao, Confirmacao, Link, SeletorOpcoes, Vazio } from "../../Alergias/Componentes/Componentes";
import { FAIXAS, VACINAS } from "../calendarioVacinas";
import { faixaDaIdade, idadeEmMeses, isoParaData, descreverIdade } from "../situacaoVacinas";
import { formatarData } from "../../Alergias/dadosAlergias";

export const HistoricoVacinas = ({ navigation }) => {
  const { aplicacoes, perfil, removerAplicacao } = React.useContext(GlobalContextVacinas);
  const [faixa, setFaixa] = React.useState("todas");
  const [excluindo, setExcluindo] = React.useState(null);

  // Idade do paciente no dia de cada aplicação (para filtrar por faixa etária).
  const comIdade = aplicacoes.map((a) => {
    const meses = perfil?.dataNascimento ? idadeEmMeses(perfil.dataNascimento, isoParaData(a.data)) : null;
    return { ...a, idadeMeses: meses, faixa: meses != null ? faixaDaIdade(meses) : null };
  });
  const lista = comIdade.filter((a) => faixa === "todas" || a.faixa === faixa);

  const confirmar = async () => {
    const id = excluindo.id;
    setExcluindo(null);
    await removerAplicacao(id);
  };

  return (
    <View style={styles.container}>
      <Header titulo="Histórico" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>HISTÓRICO</Text>
          <Text style={styles.titulo}>Aplicações registradas</Text>
          <Text style={styles.subtitulo}>Da mais recente para a mais antiga.</Text>

          <Botao texto="+ Registrar aplicação" onPress={() => navigation.navigate("RegistrarAplicacao")} />

          <SeletorOpcoes
            rotulo="Faixa etária na data da aplicação"
            opcoes={[{ valor: "todas", rotulo: "Todas" }, ...FAIXAS]}
            valor={faixa}
            onChange={setFaixa}
          />
          <Text style={[styles.legenda, { marginTop: 8, marginBottom: 10 }]}>
            {lista.length} {lista.length === 1 ? "aplicação" : "aplicações"}
          </Text>

          {lista.length === 0 ? (
            <Vazio texto={aplicacoes.length ? "Nenhuma aplicação nessa faixa." : "Nenhuma aplicação registrada ainda."} />
          ) : (
            lista.map((a) => (
              <View key={a.id} style={styles.card}>
                <View style={styles.marcador}>
                  <Text style={styles.marcadorTexto}>{(VACINAS[a.vacina]?.nome ?? "?").charAt(0)}</Text>
                </View>
                <View style={styles.cardCorpo}>
                  <Text style={styles.cardNome}>{VACINAS[a.vacina]?.nome ?? a.vacina}</Text>
                  <Text style={styles.cardTexto}>{a.dose || "Dose"}</Text>
                  <Text style={styles.legenda}>
                    {formatarData(a.data)}
                    {a.idadeMeses != null ? ` · aos ${descreverIdade(a.idadeMeses)}` : ""}
                    {a.local ? ` · ${a.local}` : ""}
                    {a.lote ? ` · lote ${a.lote}` : ""}
                  </Text>
                  {!!a.observacoes && <Text style={styles.cardTexto}>Obs.: {a.observacoes}</Text>}
                  <View style={styles.cardAcoes}>
                    <Link texto="Editar" onPress={() => navigation.navigate("RegistrarAplicacao", { id: a.id })} />
                    <Link texto="Excluir" cor={color.vermelho} onPress={() => setExcluindo(a)} />
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Confirmacao
        visivel={!!excluindo}
        titulo="Excluir aplicação?"
        texto={excluindo ? `O registro de ${VACINAS[excluindo.vacina]?.nome} (${formatarData(excluindo.data)}) será apagado.` : ""}
        onConfirmar={confirmar}
        onCancelar={() => setExcluindo(null)}
      />
    </View>
  );
};
