import React from "react";
import { Text } from "react-native";
import { styles } from "../../../screen/css/AlergiasStyle";
import { GlobalContextAlergias } from "../GlobalContextAlergias";
import { Botao, Campo, Cancelar, JanelaModal, SeletorOpcoes } from "../Componentes/Componentes";
import { GRAVIDADES, dataParaIso, hojeTexto, isoParaTexto, mascaraData } from "../dadosAlergias";

const OUTRA = "__outra";

// Formulário (em modal) para registrar ou editar um episódio de reação.
export const FormReacao = ({ visivel, reacao, alergiaInicial, onFechar }) => {
  const { alergias, salvarReacao } = React.useContext(GlobalContextAlergias);
  const [form, setForm] = React.useState(null);
  const [erros, setErros] = React.useState({});
  const [salvando, setSalvando] = React.useState(false);

  // Reinicia o formulário sempre que o modal abre.
  React.useEffect(() => {
    if (!visivel) return;
    const inicial = alergias.find((item) => item.id === (reacao?.alergiaId ?? alergiaInicial));
    setForm({
      alergiaId: reacao ? reacao.alergiaId ?? OUTRA : inicial?.id ?? (alergias[0]?.id || OUTRA),
      substanciaLivre: reacao && !reacao.alergiaId ? reacao.substancia : "",
      data: reacao ? isoParaTexto(reacao.data) : hojeTexto(),
      sintomas: reacao?.sintomas ?? "",
      gravidade: reacao?.gravidade ?? inicial?.gravidade ?? "desconhecida",
      observacoes: reacao?.observacoes ?? "",
    });
    setErros({});
  }, [visivel]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!form) return null;

  const alterar = (campo) => (valor) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const opcoesSubstancia = [
    ...alergias.map((item) => ({ valor: item.id, rotulo: item.substancia })),
    { valor: OUTRA, rotulo: "Outra substância" },
  ];

  const salvar = async () => {
    if (salvando) return;
    const novos = {};
    if (form.alergiaId === OUTRA && !form.substanciaLivre.trim()) novos.substanciaLivre = "Informe a substância.";
    if (!dataParaIso(form.data)) novos.data = "Data inválida. Use DD/MM/AAAA e não use datas futuras.";
    if (!form.sintomas.trim()) novos.sintomas = "Descreva os sintomas.";
    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    const alergia = alergias.find((item) => item.id === form.alergiaId);
    setSalvando(true);
    const ok = await salvarReacao({
      ...(reacao ? { id: reacao.id } : {}),
      alergiaId: alergia?.id ?? null,
      substancia: alergia ? alergia.substancia : form.substanciaLivre.trim(),
      data: dataParaIso(form.data),
      sintomas: form.sintomas.trim(),
      gravidade: form.gravidade,
      observacoes: form.observacoes.trim(),
    });
    setSalvando(false);
    if (ok) onFechar();
  };

  return (
    <JanelaModal visivel={visivel} onFechar={onFechar} titulo={reacao ? "Editar reação" : "Registrar reação"}>
      <Text style={styles.modalTexto}>Anote o que aconteceu para lembrar e mostrar ao médico.</Text>

      <SeletorOpcoes
        rotulo="Substância"
        obrigatorio
        opcoes={opcoesSubstancia}
        valor={form.alergiaId}
        onChange={(valor) => {
          alterar("alergiaId")(valor);
          const alergia = alergias.find((item) => item.id === valor);
          if (alergia && !reacao) alterar("gravidade")(alergia.gravidade);
        }}
      />
      {form.alergiaId === OUTRA && (
        <Campo
          rotulo="Qual substância?"
          obrigatorio
          placeholder="Ex.: camarão"
          value={form.substanciaLivre}
          onChangeText={alterar("substanciaLivre")}
          erro={erros.substanciaLivre}
          maxLength={80}
        />
      )}

      <Campo
        rotulo="Data"
        obrigatorio
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
        value={form.data}
        onChangeText={(texto) => alterar("data")(mascaraData(texto))}
        erro={erros.data}
        maxLength={10}
      />

      <Campo
        rotulo="Sintomas"
        obrigatorio
        multiline
        placeholder="O que você sentiu?"
        value={form.sintomas}
        onChangeText={alterar("sintomas")}
        erro={erros.sintomas}
        maxLength={400}
      />

      <SeletorOpcoes rotulo="Gravidade" opcoes={GRAVIDADES} valor={form.gravidade} onChange={alterar("gravidade")} />

      <Campo
        rotulo="Observações"
        multiline
        placeholder="Onde aconteceu, o que foi feito, remédios usados…"
        value={form.observacoes}
        onChangeText={alterar("observacoes")}
        maxLength={400}
      />

      <Botao texto={salvando ? "Salvando…" : "Salvar reação"} onPress={salvar} desativado={salvando} />
      <Cancelar onPress={onFechar} />
    </JanelaModal>
  );
};
