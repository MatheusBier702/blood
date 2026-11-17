import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/AlergiasStyle";
import { GlobalContextAlergias } from "../GlobalContextAlergias";
import { Aviso, Botao, Campo, SeletorOpcoes } from "../Componentes/Componentes";
import {
  CATEGORIAS,
  GRAVIDADES,
  SITUACOES,
  dataParaIso,
  isoParaTexto,
  mascaraData,
} from "../dadosAlergias";

const VAZIO = {
  substancia: "",
  categoria: "",
  sintomas: "",
  gravidade: "desconhecida",
  ultimaReacao: "",
  observacoes: "",
  situacao: "nao_investigada",
};

// Serve para cadastrar (sem parâmetro) e para editar (route.params.id).
export const CadastroAlergia = ({ navigation, route }) => {
  const { buscarAlergia, salvarAlergia, alergias } = React.useContext(GlobalContextAlergias);
  const existente = route.params?.id ? buscarAlergia(route.params.id) : null;

  const [form, setForm] = React.useState(() =>
    existente
      ? { ...existente, ultimaReacao: isoParaTexto(existente.ultimaReacao), observacoes: existente.observacoes ?? "" }
      : { ...VAZIO, categoria: route.params?.categoria ?? "" }
  );
  const [erros, setErros] = React.useState({});
  const [salvando, setSalvando] = React.useState(false);

  const alterar = (campo) => (valor) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const validar = () => {
    const novos = {};
    const nome = form.substancia.trim();
    if (!nome) novos.substancia = "Informe a substância.";
    else if (
      alergias.some(
        (item) => item.id !== existente?.id && item.substancia.toLowerCase() === nome.toLowerCase()
      )
    )
      novos.substancia = "Essa substância já está cadastrada.";
    if (!form.categoria) novos.categoria = "Escolha uma categoria.";
    if (!form.sintomas.trim()) novos.sintomas = "Descreva os sintomas.";
    if (form.ultimaReacao && !dataParaIso(form.ultimaReacao))
      novos.ultimaReacao = "Data inválida. Use DD/MM/AAAA e não use datas futuras.";
    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const salvar = async () => {
    if (salvando || !validar()) return;
    setSalvando(true);
    const salva = await salvarAlergia({
      ...(existente ? { id: existente.id } : {}),
      substancia: form.substancia.trim(),
      categoria: form.categoria,
      sintomas: form.sintomas.trim(),
      gravidade: form.gravidade,
      ultimaReacao: form.ultimaReacao ? dataParaIso(form.ultimaReacao) : null,
      observacoes: form.observacoes.trim(),
      situacao: form.situacao,
    });
    setSalvando(false);
    if (!salva) return;
    if (existente) navigation.goBack();
    else navigation.replace("DetalheAlergia", { id: salva.id });
  };

  const temErros = Object.values(erros).some(Boolean);

  return (
    <View style={styles.container}>
      <Header titulo={existente ? "Editar alergia" : "Cadastrar alergia"} voltar />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>{existente ? "EDITAR" : "NOVA ALERGIA"}</Text>
          <Text style={styles.titulo}>{existente ? existente.substancia : "Cadastrar alergia"}</Text>
          <Text style={styles.subtitulo}>
            Campos com <Text style={styles.obrigatorio}>*</Text> são obrigatórios.
          </Text>

          <Campo
            rotulo="Nome da substância"
            obrigatorio
            placeholder="Ex.: dipirona, leite, pólen"
            value={form.substancia}
            onChangeText={alterar("substancia")}
            erro={erros.substancia}
            maxLength={80}
          />

          <SeletorOpcoes
            rotulo="Categoria"
            obrigatorio
            opcoes={CATEGORIAS}
            valor={form.categoria}
            onChange={alterar("categoria")}
            erro={erros.categoria}
          />
          {!!form.categoria && (
            <Text style={[styles.legenda, { marginTop: 6 }]}>
              Exemplos: {CATEGORIAS.find((item) => item.valor === form.categoria)?.exemplos}
            </Text>
          )}

          <Campo
            rotulo="Sintomas"
            obrigatorio
            multiline
            placeholder="O que você sente quando tem contato com a substância?"
            value={form.sintomas}
            onChangeText={alterar("sintomas")}
            erro={erros.sintomas}
            maxLength={400}
          />

          <SeletorOpcoes rotulo="Gravidade" opcoes={GRAVIDADES} valor={form.gravidade} onChange={alterar("gravidade")} />

          <Campo
            rotulo="Data da última reação"
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            value={form.ultimaReacao}
            onChangeText={(texto) => alterar("ultimaReacao")(mascaraData(texto))}
            erro={erros.ultimaReacao}
            maxLength={10}
          />

          <SeletorOpcoes rotulo="Situação" opcoes={SITUACOES} valor={form.situacao} onChange={alterar("situacao")} />

          <Campo
            rotulo="Observações"
            multiline
            placeholder="Cuidados, remédios que podem substituir, orientações médicas…"
            value={form.observacoes}
            onChangeText={alterar("observacoes")}
            maxLength={400}
          />

          {temErros && <Aviso erro texto="Confira os campos destacados antes de salvar." />}

          <Botao
            texto={salvando ? "Salvando…" : existente ? "Salvar alterações" : "Cadastrar alergia"}
            onPress={salvar}
            desativado={salvando}
          />
          <Botao texto="Cancelar" variante="secundario" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </View>
  );
};
