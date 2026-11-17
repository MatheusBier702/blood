import React from "react";
import { Image, Platform, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../../../screen/css/AlergiasStyle";
import { GlobalContextAlergias } from "../GlobalContextAlergias";
import { Botao, BotaoPequeno, Campo, Cancelar, JanelaModal, Link, SeletorOpcoes } from "../Componentes/Componentes";
import { TIPOS_DOCUMENTO, dataParaIso, hojeTexto, mascaraData } from "../dadosAlergias";

const NENHUMA = "__nenhuma";

// Formulário (em modal) para anexar um exame, laudo ou documento.
// O arquivo é uma foto/imagem escolhida com o expo-image-picker.
export const FormDocumento = ({ visivel, alergiaInicial, onFechar }) => {
  const { alergias, salvarDocumento } = React.useContext(GlobalContextAlergias);
  const [form, setForm] = React.useState(null);
  const [erros, setErros] = React.useState({});
  const [ocupado, setOcupado] = React.useState(false);

  React.useEffect(() => {
    if (!visivel) return;
    setForm({
      titulo: "",
      tipo: "exame",
      data: hojeTexto(),
      alergiaId: alergiaInicial ?? NENHUMA,
      observacoes: "",
      uri: null,
      nomeArquivo: "",
    });
    setErros({});
  }, [visivel]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!form) return null;

  const alterar = (campo) => (valor) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const escolherArquivo = async (origem) => {
    if (ocupado) return;
    setOcupado(true);
    setErros((atual) => ({ ...atual, arquivo: undefined }));
    try {
      if (origem === "camera") {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissao.granted) {
          setErros((atual) => ({ ...atual, arquivo: "Permita o uso da câmera para fotografar o documento." }));
          return;
        }
      }
      const opcoes = { mediaTypes: ["images"], quality: 0.8 };
      const resultado =
        origem === "camera"
          ? await ImagePicker.launchCameraAsync(opcoes)
          : await ImagePicker.launchImageLibraryAsync(opcoes);
      const arquivo = resultado.assets?.[0];
      if (!resultado.canceled && arquivo?.uri) {
        setForm((atual) => ({ ...atual, uri: arquivo.uri, nomeArquivo: arquivo.fileName ?? "" }));
      }
    } catch {
      setErros((atual) => ({ ...atual, arquivo: "Não foi possível abrir o arquivo. Tente novamente." }));
    } finally {
      setOcupado(false);
    }
  };

  const salvar = async () => {
    if (ocupado) return;
    const novos = {};
    if (!form.titulo.trim()) novos.titulo = "Dê um nome ao documento.";
    if (!dataParaIso(form.data)) novos.data = "Data inválida. Use DD/MM/AAAA e não use datas futuras.";
    if (!form.uri) novos.arquivo = "Anexe a imagem do documento.";
    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    setOcupado(true);
    const ok = await salvarDocumento({
      titulo: form.titulo.trim(),
      tipo: form.tipo,
      data: dataParaIso(form.data),
      alergiaId: form.alergiaId === NENHUMA ? null : form.alergiaId,
      observacoes: form.observacoes.trim(),
      uri: form.uri,
    });
    setOcupado(false);
    if (ok) onFechar();
  };

  const opcoesAlergia = [
    { valor: NENHUMA, rotulo: "Nenhuma" },
    ...alergias.map((item) => ({ valor: item.id, rotulo: item.substancia })),
  ];

  return (
    <JanelaModal visivel={visivel} onFechar={onFechar} titulo="Anexar documento">
      <Text style={styles.modalTexto}>Guarde uma foto do exame, laudo ou receita para consultar quando precisar.</Text>

      <View style={styles.campo}>
        <Text style={styles.rotulo}>
          Arquivo<Text style={styles.obrigatorio}> *</Text>
        </Text>
        <View style={[styles.anexo, !!erros.arquivo && styles.inputErro]}>
          {form.uri ? (
            <>
              <Image source={{ uri: form.uri }} style={styles.anexoImagem} resizeMode="cover" />
              <Link texto="Trocar imagem" onPress={() => escolherArquivo("galeria")} />
            </>
          ) : (
            <>
              <Text style={styles.legenda}>{ocupado ? "Abrindo…" : "Nenhum arquivo anexado"}</Text>
              <View style={styles.botoesLinha}>
                <BotaoPequeno
                  texto={Platform.OS === "web" ? "Escolher imagem" : "Galeria"}
                  onPress={() => escolherArquivo("galeria")}
                />
                {Platform.OS !== "web" && <BotaoPequeno texto="Câmera" onPress={() => escolherArquivo("camera")} />}
              </View>
            </>
          )}
        </View>
        {!!erros.arquivo && <Text style={styles.erroCampo}>{erros.arquivo}</Text>}
      </View>

      <Campo
        rotulo="Nome do documento"
        obrigatorio
        placeholder="Ex.: Teste alérgico de pele"
        value={form.titulo}
        onChangeText={alterar("titulo")}
        erro={erros.titulo}
        maxLength={80}
      />

      <SeletorOpcoes rotulo="Tipo" opcoes={TIPOS_DOCUMENTO} valor={form.tipo} onChange={alterar("tipo")} />

      <Campo
        rotulo="Data do documento"
        obrigatorio
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
        value={form.data}
        onChangeText={(texto) => alterar("data")(mascaraData(texto))}
        erro={erros.data}
        maxLength={10}
      />

      <SeletorOpcoes
        rotulo="Alergia relacionada"
        opcoes={opcoesAlergia}
        valor={form.alergiaId}
        onChange={alterar("alergiaId")}
      />

      <Campo
        rotulo="Observações"
        multiline
        placeholder="Resultado, médico responsável, laboratório…"
        value={form.observacoes}
        onChangeText={alterar("observacoes")}
        maxLength={400}
      />

      <Botao texto={ocupado ? "Aguarde…" : "Salvar documento"} onPress={salvar} desativado={ocupado} />
      <Cancelar onPress={onFechar} />
    </JanelaModal>
  );
};
