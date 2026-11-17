import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/VacinasStyle";
import { GlobalContextVacinas } from "../GlobalContextVacinas";
import { Aviso, Botao, Campo, SeletorOpcoes } from "../../Alergias/Componentes/Componentes";
import { RECOMENDACOES, VACINAS } from "../calendarioVacinas";
import { dataParaIso, hojeTexto, isoParaTexto, mascaraData } from "../../Alergias/dadosAlergias";
import { isoParaData } from "../situacaoVacinas";

const OPCOES_VACINA = Object.entries(VACINAS)
  .map(([valor, v]) => ({ valor, rotulo: v.nome }))
  .sort((a, b) => a.rotulo.localeCompare(b.rotulo, "pt-BR"));

// Sugestões de nome de dose para a vacina escolhida, tiradas do calendário.
const sugestoesDeDose = (vacina) => {
  const nomes = new Set();
  RECOMENDACOES.filter((r) => r.regra.chaves[0] === vacina || r.vacina === vacina).forEach((r) => {
    (r.regra.doses || []).forEach((d) => nomes.add(d.rotulo));
  });
  ["1ª dose", "2ª dose", "3ª dose", "Reforço", "Dose anual", "Dose única"].forEach((n) => nomes.add(n));
  return [...nomes].slice(0, 8).map((n) => ({ valor: n, rotulo: n }));
};

// Serve para registrar (sem parâmetro) e para editar (route.params.id).
export const RegistrarAplicacao = ({ navigation, route }) => {
  const { aplicacoes, perfil, salvarAplicacao } = React.useContext(GlobalContextVacinas);
  const existente = route.params?.id ? aplicacoes.find((a) => a.id === route.params.id) : null;

  const [form, setForm] = React.useState(() =>
    existente
      ? { ...existente, data: isoParaTexto(existente.data), local: existente.local ?? "", lote: existente.lote ?? "", observacoes: existente.observacoes ?? "" }
      : { vacina: route.params?.vacina ?? "", dose: "", data: hojeTexto(), local: "", lote: "", observacoes: "" }
  );
  const [erros, setErros] = React.useState({});
  const [salvando, setSalvando] = React.useState(false);

  const alterar = (campo) => (valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  };

  const validar = () => {
    const novos = {};
    if (!form.vacina) novos.vacina = "Escolha a vacina.";
    if (!form.dose.trim()) novos.dose = "Informe qual dose foi aplicada.";
    const iso = dataParaIso(form.data);
    if (!form.data) novos.data = "Informe a data da aplicação.";
    else if (!iso) novos.data = "Data inválida. Use DD/MM/AAAA e não use datas futuras.";
    else if (perfil?.dataNascimento && isoParaData(iso) < isoParaData(perfil.dataNascimento))
      novos.data = "A data não pode ser anterior ao nascimento.";
    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const salvar = async () => {
    if (salvando || !validar()) return;
    setSalvando(true);
    const salva = await salvarAplicacao({
      ...(existente ? { id: existente.id } : {}),
      vacina: form.vacina,
      dose: form.dose.trim(),
      data: dataParaIso(form.data),
      local: form.local.trim(),
      lote: form.lote.trim(),
      observacoes: form.observacoes.trim(),
    });
    setSalvando(false);
    if (salva) navigation.goBack();
  };

  const temErros = Object.values(erros).some(Boolean);

  return (
    <View style={styles.container}>
      <Header titulo={existente ? "Editar aplicação" : "Registrar aplicação"} voltar />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>{existente ? "EDITAR" : "NOVA APLICAÇÃO"}</Text>
          <Text style={styles.titulo}>{existente ? "Editar aplicação" : "Registrar aplicação"}</Text>
          <Text style={styles.subtitulo}>
            Copie as informações da caderneta de vacinação. Campos com <Text style={styles.obrigatorio}>*</Text> são
            obrigatórios.
          </Text>

          <SeletorOpcoes
            rotulo="Vacina"
            obrigatorio
            opcoes={OPCOES_VACINA}
            valor={form.vacina}
            onChange={(v) => {
              alterar("vacina")(v);
              alterar("dose")("");
            }}
            erro={erros.vacina}
          />

          {!!form.vacina && (
            <SeletorOpcoes rotulo="Dose" obrigatorio opcoes={sugestoesDeDose(form.vacina)} valor={form.dose} onChange={alterar("dose")} />
          )}
          <Campo
            rotulo={form.vacina ? "Ou escreva a dose" : "Dose"}
            obrigatorio={!form.vacina}
            placeholder="Ex.: 1ª dose, reforço, dose anual"
            value={form.dose}
            onChangeText={alterar("dose")}
            erro={erros.dose}
            maxLength={40}
          />

          <Campo
            rotulo="Data da aplicação"
            obrigatorio
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            value={form.data}
            onChangeText={(t) => alterar("data")(mascaraData(t))}
            erro={erros.data}
            maxLength={10}
          />
          <Campo rotulo="Local" placeholder="Ex.: UBS do bairro" value={form.local} onChangeText={alterar("local")} maxLength={80} />
          <Campo rotulo="Lote" placeholder="Opcional" value={form.lote} onChangeText={alterar("lote")} maxLength={30} />
          <Campo
            rotulo="Observações"
            multiline
            placeholder="Ex.: reação no local, campanha de vacinação…"
            value={form.observacoes}
            onChangeText={alterar("observacoes")}
            maxLength={300}
          />

          {temErros && <Aviso erro texto="Confira os campos destacados antes de salvar." />}
          <Botao texto={salvando ? "Salvando…" : existente ? "Salvar alterações" : "Registrar aplicação"} onPress={salvar} desativado={salvando} />
          <Botao texto="Cancelar" variante="secundario" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </View>
  );
};
