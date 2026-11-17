import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/AlergiasStyle";
import { GlobalContextAlergias } from "../GlobalContextAlergias";
import {
  Botao,
  CampoDetalhe,
  Cancelar,
  Chip,
  Confirmacao,
  JanelaModal,
  SeletorOpcoes,
  Vazio,
} from "../Componentes/Componentes";
import { TIPOS_DOCUMENTO, formatarData, rotuloTipoDocumento } from "../dadosAlergias";
import { FormDocumento } from "./FormDocumento";

const Miniatura = ({ documento }) => (
  <View style={styles.miniatura}>
    {documento.uri ? (
      <Image source={{ uri: documento.uri }} style={styles.miniaturaImagem} resizeMode="cover" />
    ) : (
      <Text style={styles.miniaturaTexto}>{rotuloTipoDocumento(documento.tipo).toUpperCase().slice(0, 4)}</Text>
    )}
  </View>
);

export const Documentos = ({ navigation, route }) => {
  const { documentos, buscarAlergia, removerDocumento } = React.useContext(GlobalContextAlergias);
  const [filtro, setFiltro] = React.useState("todos");
  const [formulario, setFormulario] = React.useState({ visivel: false, alergiaInicial: null });
  const [aberto, setAberto] = React.useState(null);
  const [excluindo, setExcluindo] = React.useState(null);

  // Vindo do detalhe de uma alergia ("Anexar"), já abre o formulário vinculado.
  const novoPara = route.params?.novoPara;
  React.useEffect(() => {
    if (!novoPara) return;
    setFormulario({ visivel: true, alergiaInicial: novoPara });
    navigation.setParams({ novoPara: undefined });
  }, [novoPara, navigation]);

  const filtros = [{ valor: "todos", rotulo: "Todos" }, ...TIPOS_DOCUMENTO];
  const lista = documentos.filter((item) => filtro === "todos" || item.tipo === filtro);

  const confirmarExclusao = async () => {
    const id = excluindo.id;
    setExcluindo(null);
    setAberto(null);
    await removerDocumento(id);
  };

  // Guarda o último documento aberto para o conteúdo não sumir na animação de saída.
  const ultimoAberto = React.useRef(null);
  if (aberto) ultimoAberto.current = aberto;
  const doc = ultimoAberto.current;
  const alergiaDoAberto = doc?.alergiaId ? buscarAlergia(doc.alergiaId) : null;

  return (
    <View style={styles.container}>
      <Header titulo="Documentos" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>DOCUMENTOS</Text>
          <Text style={styles.titulo}>Exames, laudos e receitas</Text>
          <Text style={styles.subtitulo}>Toque em um documento para abrir.</Text>

          <Botao
            texto="+ Anexar documento"
            onPress={() => setFormulario({ visivel: true, alergiaInicial: null })}
          />

          <SeletorOpcoes opcoes={filtros} valor={filtro} onChange={setFiltro} />

          <View style={{ marginTop: 10 }}>
            {lista.length === 0 ? (
              <Vazio
                texto={documentos.length === 0 ? "Nenhum documento anexado ainda." : "Nenhum documento desse tipo."}
              />
            ) : (
              lista.map((documento) => {
                const alergia = documento.alergiaId ? buscarAlergia(documento.alergiaId) : null;
                return (
                  <Pressable
                    key={documento.id}
                    onPress={() => setAberto(documento)}
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir ${documento.titulo}`}
                    style={({ pressed }) => [styles.card, pressed && styles.pressionado]}
                  >
                    <Miniatura documento={documento} />
                    <View style={styles.cardCorpo}>
                      <Text style={styles.cardNome}>{documento.titulo}</Text>
                      <Text style={styles.legenda}>{formatarData(documento.data)}</Text>
                      <View style={styles.cardInfo}>
                        <Chip texto={rotuloTipoDocumento(documento.tipo)} />
                        {!!alergia && <Chip texto={alergia.substancia} />}
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>

      <FormDocumento
        visivel={formulario.visivel}
        alergiaInicial={formulario.alergiaInicial}
        onFechar={() => setFormulario({ visivel: false, alergiaInicial: null })}
      />

      <JanelaModal visivel={!!aberto && !excluindo} onFechar={() => setAberto(null)} titulo={doc?.titulo}>
        {!!doc && (
          <View style={{ marginTop: 14 }}>
            {doc.uri ? (
              <Image
                source={{ uri: doc.uri }}
                style={styles.visualizacao}
                resizeMode="contain"
                accessibilityLabel={`Imagem de ${doc.titulo}`}
              />
            ) : (
              <View style={styles.semArquivo}>
                <Text style={styles.semArquivoTexto}>
                  Documento de exemplo, sem imagem anexada.
                </Text>
              </View>
            )}
            <CampoDetalhe rotulo="Tipo" valor={rotuloTipoDocumento(doc.tipo)} />
            <CampoDetalhe rotulo="Data" valor={formatarData(doc.data)} />
            <CampoDetalhe rotulo="Alergia relacionada" valor={alergiaDoAberto?.substancia ?? "Nenhuma"} />
            <CampoDetalhe rotulo="Observações" valor={doc.observacoes} ultimo />

            {!!alergiaDoAberto && (
              <Botao
                texto="Ver alergia"
                variante="secundario"
                style={{ marginTop: 20 }}
                onPress={() => {
                  setAberto(null);
                  navigation.navigate("DetalheAlergia", { id: alergiaDoAberto.id });
                }}
              />
            )}
            <Botao texto="Excluir documento" variante="perigo" onPress={() => setExcluindo(doc)} />
            <Cancelar texto="Fechar" onPress={() => setAberto(null)} />
          </View>
        )}
      </JanelaModal>

      <Confirmacao
        visivel={!!excluindo}
        titulo="Excluir documento?"
        texto={excluindo ? `"${excluindo.titulo}" será removido dos seus documentos.` : ""}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setExcluindo(null)}
      />
    </View>
  );
};
