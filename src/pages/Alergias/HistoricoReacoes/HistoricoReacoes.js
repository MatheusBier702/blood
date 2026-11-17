import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/AlergiasStyle";
import { GlobalContextAlergias } from "../GlobalContextAlergias";
import { Botao, Confirmacao, EtiquetaGravidade, Link, SeletorOpcoes, Vazio } from "../Componentes/Componentes";
import { GRAVIDADES, formatarData } from "../dadosAlergias";
import { FormReacao } from "./FormReacao";

export const HistoricoReacoes = ({ navigation, route }) => {
  const { reacoes, removerReacao } = React.useContext(GlobalContextAlergias);
  const [filtro, setFiltro] = React.useState("todas");
  const [formulario, setFormulario] = React.useState({ visivel: false, reacao: null, alergiaInicial: null });
  const [excluindo, setExcluindo] = React.useState(null);

  // Vindo do detalhe de uma alergia ("Registrar reação"), já abre o formulário.
  const novaPara = route.params?.novaPara;
  React.useEffect(() => {
    if (!novaPara) return;
    setFormulario({ visivel: true, reacao: null, alergiaInicial: novaPara });
    navigation.setParams({ novaPara: undefined });
  }, [novaPara, navigation]);

  const filtros = [{ valor: "todas", rotulo: "Todas" }, ...GRAVIDADES];
  const lista = reacoes.filter((item) => filtro === "todas" || item.gravidade === filtro);

  const confirmarExclusao = async () => {
    const id = excluindo.id;
    setExcluindo(null);
    await removerReacao(id);
  };

  return (
    <View style={styles.container}>
      <Header titulo="Histórico" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>HISTÓRICO</Text>
          <Text style={styles.titulo}>Episódios de reação</Text>
          <Text style={styles.subtitulo}>Da mais recente para a mais antiga.</Text>

          <Botao
            texto="+ Registrar reação"
            onPress={() => setFormulario({ visivel: true, reacao: null, alergiaInicial: null })}
          />

          <SeletorOpcoes opcoes={filtros} valor={filtro} onChange={setFiltro} />

          <View style={{ marginTop: 10 }}>
            {lista.length === 0 ? (
              <Vazio
                texto={reacoes.length === 0 ? "Nenhuma reação registrada ainda." : "Nenhuma reação com essa gravidade."}
              />
            ) : (
              lista.map((reacao) => {
                const grave = reacao.gravidade === "grave";
                return (
                  <View key={reacao.id} style={[styles.card, grave && styles.cardGrave]}>
                    <View style={[styles.marcador, grave && styles.marcadorGrave]}>
                      <Text style={styles.marcadorTexto}>{grave ? "!" : reacao.substancia.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.cardCorpo}>
                      <Text style={styles.cardNome}>{reacao.substancia}</Text>
                      <Text style={styles.legenda}>{formatarData(reacao.data)}</Text>
                      <Text style={styles.cardTexto}>{reacao.sintomas}</Text>
                      {!!reacao.observacoes && (
                        <Text style={styles.cardTexto}>Obs.: {reacao.observacoes}</Text>
                      )}
                      <View style={styles.cardInfo}>
                        <EtiquetaGravidade gravidade={reacao.gravidade} />
                      </View>
                      <View style={styles.cardAcoes}>
                        {!!reacao.alergiaId && (
                          <Link
                            texto="Ver alergia"
                            onPress={() => navigation.navigate("DetalheAlergia", { id: reacao.alergiaId })}
                          />
                        )}
                        <Link
                          texto="Editar"
                          onPress={() => setFormulario({ visivel: true, reacao, alergiaInicial: null })}
                        />
                        <Link texto="Excluir" cor={color.vermelho} onPress={() => setExcluindo(reacao)} />
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>

      <FormReacao
        visivel={formulario.visivel}
        reacao={formulario.reacao}
        alergiaInicial={formulario.alergiaInicial}
        onFechar={() => setFormulario({ visivel: false, reacao: null, alergiaInicial: null })}
      />

      <Confirmacao
        visivel={!!excluindo}
        titulo="Excluir reação?"
        texto={excluindo ? `O registro de ${formatarData(excluindo.data)} (${excluindo.substancia}) será apagado.` : ""}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setExcluindo(null)}
      />
    </View>
  );
};
