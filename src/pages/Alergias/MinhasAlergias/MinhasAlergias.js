import React from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import Header from "../../../screen/components/Header";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/AlergiasStyle";
import { GlobalContextAlergias } from "../GlobalContextAlergias";
import { CardAlergia } from "../CardAlergia/CardAlergia";
import { Botao, SeletorOpcoes, Vazio } from "../Componentes/Componentes";
import { CATEGORIAS } from "../dadosAlergias";

const semAcento = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export const MinhasAlergias = ({ navigation }) => {
  const { alergias } = React.useContext(GlobalContextAlergias);
  const [categoria, setCategoria] = React.useState("todas");
  const [busca, setBusca] = React.useState("");

  const filtros = [
    { valor: "todas", rotulo: `Todas (${alergias.length})` },
    ...CATEGORIAS.map((item) => ({
      valor: item.valor,
      rotulo: `${item.rotulo} (${alergias.filter((a) => a.categoria === item.valor).length})`,
    })),
  ];

  const termo = semAcento(busca.trim());
  const filtradas = alergias.filter(
    (alergia) =>
      (categoria === "todas" || alergia.categoria === categoria) &&
      (!termo || semAcento(`${alergia.substancia} ${alergia.sintomas}`).includes(termo))
  );

  // Agrupa por categoria, na mesma ordem da lista de categorias.
  const grupos = CATEGORIAS.map((item) => ({
    ...item,
    itens: filtradas.filter((alergia) => alergia.categoria === item.valor),
  })).filter((grupo) => grupo.itens.length > 0);

  const abrirDetalhe = (alergia) => navigation.navigate("DetalheAlergia", { id: alergia.id });

  return (
    <View style={styles.container}>
      <Header titulo="Minhas alergias" voltar />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>MINHAS ALERGIAS</Text>
          <Text style={styles.titulo}>Alergias por categoria</Text>
          <Text style={styles.subtitulo}>Toque em uma alergia para ver os detalhes, editar ou excluir.</Text>

          <View style={styles.busca}>
            <View style={styles.iconeBusca} accessible={false}>
              <View style={styles.lupa} />
              <View style={styles.cabo} />
            </View>
            <TextInput
              placeholder="Buscar substância ou sintoma"
              placeholderTextColor={color.textoSuave}
              accessibilityLabel="Buscar alergia"
              value={busca}
              onChangeText={setBusca}
              autoCapitalize="none"
              style={styles.inputBusca}
            />
          </View>

          <SeletorOpcoes opcoes={filtros} valor={categoria} onChange={setCategoria} />

          {grupos.length === 0 ? (
            <View style={{ marginTop: 18 }}>
              <Vazio
                texto={
                  alergias.length === 0
                    ? "Você ainda não cadastrou nenhuma alergia."
                    : "Nenhuma alergia encontrada com esse filtro."
                }
                rotuloAcao="Cadastrar alergia"
                acao={() =>
                  navigation.navigate("CadastroAlergia", categoria !== "todas" ? { categoria } : undefined)
                }
              />
            </View>
          ) : (
            grupos.map((grupo) => (
              <View key={grupo.valor}>
                <View style={styles.secaoLinha}>
                  <Text style={styles.secao}>{grupo.rotulo}</Text>
                  <Text style={styles.legenda}>{grupo.itens.length}</Text>
                </View>
                {grupo.itens.map((alergia) => (
                  <CardAlergia key={alergia.id} alergia={alergia} onPress={abrirDetalhe} mostrarCategoria={false} />
                ))}
              </View>
            ))
          )}

          <Botao
            texto="+ Cadastrar alergia"
            onPress={() => navigation.navigate("CadastroAlergia", categoria !== "todas" ? { categoria } : undefined)}
          />
        </View>
      </ScrollView>
    </View>
  );
};
