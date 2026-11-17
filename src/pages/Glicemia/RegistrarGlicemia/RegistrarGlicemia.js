import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/GlicemiaStyle";
import { GlobalContextGlicemia } from "../GlobalContextGlicemia";
import { Aviso, Botao, Campo, SeletorOpcoes } from "../../Alergias/Componentes/Componentes";
import {
  MOMENTOS,
  VALOR_MAXIMO,
  VALOR_MINIMO,
  agoraHora,
  dataParaIso,
  formatarData,
  hojeTexto,
  horaValida,
  mascaraData,
  mascaraHora,
} from "../dadosGlicemia";

// Serve para registrar (sem parâmetro) e para editar (route.params.id).
export const RegistrarGlicemia = ({ navigation, route }) => {
  const { buscarMedicao, salvarMedicao } = React.useContext(GlobalContextGlicemia);
  const existente = route.params?.id ? buscarMedicao(route.params.id) : null;

  const [form, setForm] = React.useState(() =>
    existente
      ? {
          valor: String(existente.valor),
          data: formatarData(existente.data),
          hora: existente.hora,
          momento: existente.momento,
          observacoes: existente.observacoes ?? "",
        }
      : { valor: "", data: hojeTexto(), hora: agoraHora(), momento: "", observacoes: "" }
  );
  const [erros, setErros] = React.useState({});
  const [salvando, setSalvando] = React.useState(false);

  const alterar = (campo) => (valor) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const validar = () => {
    const novos = {};
    const texto = form.valor.trim();
    const valor = Number(texto);
    if (!texto) novos.valor = "Informe o valor da glicemia.";
    else if (!/^\d+$/.test(texto)) novos.valor = "Use apenas números inteiros (sem vírgula ou ponto).";
    else if (valor < VALOR_MINIMO || valor > VALOR_MAXIMO)
      novos.valor = `Digite um valor entre ${VALOR_MINIMO} e ${VALOR_MAXIMO} mg/dL, a faixa que os glicosímetros medem.`;

    const dataIso = dataParaIso(form.data);
    if (!form.data) novos.data = "Informe a data da medição.";
    else if (!dataIso) novos.data = "Data inválida. Use DD/MM/AAAA e não use datas futuras.";

    if (!form.hora) novos.hora = "Informe o horário da medição.";
    else if (!horaValida(form.hora)) novos.hora = "Horário inválido. Use HH:MM (ex.: 07:30).";
    else if (dataIso) {
      const [ano, mes, dia] = dataIso.split("-").map(Number);
      const [h, m] = form.hora.split(":").map(Number);
      if (new Date(ano, mes - 1, dia, h, m) > new Date()) novos.hora = "Esse horário ainda não chegou.";
    }

    if (!form.momento) novos.momento = "Escolha o momento da medição.";
    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const salvar = async () => {
    if (salvando || !validar()) return;
    setSalvando(true);
    const salva = await salvarMedicao({
      ...(existente ? { id: existente.id } : {}),
      valor: Number(form.valor),
      data: dataParaIso(form.data),
      hora: form.hora,
      momento: form.momento,
      observacoes: form.observacoes.trim(),
    });
    setSalvando(false);
    if (!salva) return;
    if (existente) navigation.goBack();
    else navigation.replace("DetalheMedicao", { id: salva.id, nova: true });
  };

  const temErros = Object.values(erros).some(Boolean);

  return (
    <View style={styles.container}>
      <Header titulo={existente ? "Editar medição" : "Registrar glicemia"} voltar />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>{existente ? "EDITAR" : "NOVA MEDIÇÃO"}</Text>
          <Text style={styles.titulo}>{existente ? "Editar medição" : "Registrar glicemia"}</Text>
          <Text style={styles.subtitulo}>
            Campos com <Text style={styles.obrigatorio}>*</Text> são obrigatórios.
          </Text>

          <Campo
            rotulo="Valor da glicemia (mg/dL)"
            obrigatorio
            placeholder="Ex.: 98"
            keyboardType="number-pad"
            value={form.valor}
            onChangeText={(texto) => alterar("valor")(texto.replace(/[^\d.,]/g, "").slice(0, 4))}
            erro={erros.valor}
            maxLength={4}
          />

          <View style={styles.botoesLinha}>
            <View style={styles.botaoMetade}>
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
            </View>
            <View style={styles.botaoMetade}>
              <Campo
                rotulo="Horário"
                obrigatorio
                placeholder="HH:MM"
                keyboardType="numeric"
                value={form.hora}
                onChangeText={(texto) => alterar("hora")(mascaraHora(texto))}
                erro={erros.hora}
                maxLength={5}
              />
            </View>
          </View>

          <SeletorOpcoes
            rotulo="Momento da medição"
            obrigatorio
            opcoes={MOMENTOS}
            valor={form.momento}
            onChange={alterar("momento")}
            erro={erros.momento}
          />

          <Campo
            rotulo="Observações"
            multiline
            placeholder="Ex.: o que comeu, atividade física, remédios, se estava doente…"
            value={form.observacoes}
            onChangeText={alterar("observacoes")}
            maxLength={400}
          />

          {temErros && <Aviso erro texto="Confira os campos destacados antes de salvar." />}

          <Botao
            texto={salvando ? "Salvando…" : existente ? "Salvar alterações" : "Registrar medição"}
            onPress={salvar}
            desativado={salvando}
          />
          <Botao texto="Cancelar" variante="secundario" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </View>
  );
};
