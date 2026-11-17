import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/AlergiasStyle";
import { GlobalContextAlergias } from "../GlobalContextAlergias";
import { Aviso, Botao, Campo, Confirmacao, EtiquetaGravidade, Link, Secao, Vazio } from "../Componentes/Componentes";
import { formatarData, rotuloCategoria, rotuloSituacao } from "../dadosAlergias";

// Tela pensada para ser mostrada a um profissional de saúde: tudo o que é
// grave aparece primeiro, em destaque e sem precisar tocar em nada.
export const Alertas = ({ navigation }) => {
  const { nome, tipoSangue, alergias, graves, informacoes, salvarInformacao, removerInformacao } =
    React.useContext(GlobalContextAlergias);
  const [novaInformacao, setNovaInformacao] = React.useState("");
  const [erroInformacao, setErroInformacao] = React.useState("");
  const [excluindo, setExcluindo] = React.useState(null);

  const demais = alergias.filter((item) => item.gravidade !== "grave");

  const adicionarInformacao = async () => {
    const texto = novaInformacao.trim();
    if (!texto) {
      setErroInformacao("Escreva a informação antes de adicionar.");
      return;
    }
    const ok = await salvarInformacao({ texto });
    if (ok) setNovaInformacao("");
  };

  const confirmarExclusao = async () => {
    const id = excluindo.id;
    setExcluindo(null);
    await removerInformacao(id);
  };

  return (
    <View style={styles.container}>
      <Header titulo="Alertas" voltar />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>ALERTAS</Text>
          <Text style={styles.titulo}>Consulta rápida</Text>
          <Text style={styles.subtitulo}>Mostre esta tela à equipe de saúde em consultas e emergências.</Text>

          <View style={styles.destaque}>
            <Text style={styles.destaqueTitulo}>Cartão de alergias</Text>
            <View style={styles.dadosPaciente}>
              <View style={styles.dadoPaciente}>
                <Text style={styles.dadoPacienteTexto}>Paciente: {nome || "não informado"}</Text>
              </View>
              <View style={styles.dadoPaciente}>
                <Text style={styles.dadoPacienteTexto}>Tipo sanguíneo: {tipoSangue || "não informado"}</Text>
              </View>
            </View>

            {graves.length === 0 ? (
              <Text style={[styles.destaqueTexto, { marginTop: 12 }]}>Nenhuma alergia grave cadastrada.</Text>
            ) : (
              <>
                <Text style={styles.destaqueValor}>
                  {graves.length === 1 ? "1 alergia grave" : `${graves.length} alergias graves`}
                </Text>
                <View style={styles.destaqueLista}>
                  {graves.map((alergia) => (
                    <View key={alergia.id} style={styles.destaqueItem}>
                      <Text style={styles.destaqueItemNome}>{alergia.substancia.toUpperCase()}</Text>
                      <Text style={styles.destaqueTexto}>
                        {rotuloCategoria(alergia.categoria)} · {rotuloSituacao(alergia.situacao)}
                      </Text>
                      <Text style={[styles.destaqueTexto, { color: color.branco }]}>Reação: {alergia.sintomas}</Text>
                      {!!alergia.observacoes && <Text style={styles.destaqueTexto}>{alergia.observacoes}</Text>}
                      <Text style={styles.destaqueTexto}>Última reação: {formatarData(alergia.ultimaReacao)}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {informacoes.length > 0 && (
              <View style={{ marginTop: 14 }}>
                <Text style={styles.destaqueTitulo}>Informações importantes</Text>
                {informacoes.map((info) => (
                  <Text key={info.id} style={styles.destaqueTexto}>
                    • {info.texto}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {graves.length === 0 && alergias.length === 0 && (
            <Aviso
              texto="Cadastre suas alergias para que elas apareçam aqui."
              acao={() => navigation.navigate("CadastroAlergia")}
              rotuloAcao="Cadastrar alergia"
            />
          )}

          <Secao titulo="Outras alergias" />
          {demais.length === 0 ? (
            <Vazio texto="Nenhuma outra alergia cadastrada." />
          ) : (
            demais.map((alergia) => (
              <View key={alergia.id} style={styles.card}>
                <View style={styles.cardCorpo}>
                  <Text style={styles.cardNome}>{alergia.substancia}</Text>
                  <Text style={styles.cardTexto}>{alergia.sintomas}</Text>
                  <View style={styles.cardInfo}>
                    <EtiquetaGravidade gravidade={alergia.gravidade} />
                    <View style={styles.chip}>
                      <Text style={styles.chipTexto}>{rotuloSituacao(alergia.situacao)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}

          <Secao titulo="Informações importantes" />
          <Text style={styles.legenda}>
            Ex.: uso de caneta de adrenalina, contato de emergência, outras condições de saúde.
          </Text>
          <View style={{ marginTop: 10 }}>
            {informacoes.length === 0 ? (
              <Vazio texto="Nenhuma informação adicionada." />
            ) : (
              informacoes.map((info) => (
                <View key={info.id} style={styles.card}>
                  <View style={styles.cardCorpo}>
                    <Text style={styles.cardNome}>{info.texto}</Text>
                    <View style={styles.cardAcoes}>
                      <Link texto="Remover" cor={color.vermelho} onPress={() => setExcluindo(info)} />
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          <Campo
            rotulo="Nova informação"
            placeholder="Digite uma informação importante"
            value={novaInformacao}
            onChangeText={(texto) => {
              setNovaInformacao(texto);
              setErroInformacao("");
            }}
            onSubmitEditing={adicionarInformacao}
            returnKeyType="done"
            erro={erroInformacao}
            maxLength={160}
          />
          <Botao texto="Adicionar informação" onPress={adicionarInformacao} />
        </View>
      </ScrollView>

      <Confirmacao
        visivel={!!excluindo}
        titulo="Remover informação?"
        texto={excluindo ? `"${excluindo.texto}" será removida dos alertas.` : ""}
        rotuloConfirmar="Remover"
        onConfirmar={confirmarExclusao}
        onCancelar={() => setExcluindo(null)}
      />
    </View>
  );
};
