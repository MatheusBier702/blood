import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/PressaoStyle";
import { GlobalContextPressao } from "../GlobalContextPressao";
import { Aviso, Botao, Campo, SeletorOpcoes } from "../../Alergias/Componentes/Componentes";
import {
  BRACOS,
  CONTEXTOS,
  LIMITES,
  SINTOMAS,
  agoraHora,
  dataParaIso,
  formatarData,
  hojeTexto,
  horaValida,
  mascaraData,
  mascaraHora,
  valorIncomum,
} from "../dadosPressao";

const somenteNumeros = (texto) => texto.replace(/[^\d]/g, "").slice(0, 3);

// Lê um número inteiro e confere só se é possível de medir (não bloqueia valores altos ou baixos).
const validarNumero = (texto, { minimo, maximo }, nome, obrigatorio = true) => {
  if (!texto) return obrigatorio ? `Informe a ${nome}.` : null;
  const valor = Number(texto);
  if (!Number.isInteger(valor)) return "Use apenas números inteiros.";
  if (valor < minimo || valor > maximo)
    return `Valor impossível de medir (aceito de ${minimo} a ${maximo}). Confira se não houve erro de digitação.`;
  return null;
};

// Serve para registrar (sem parâmetro) e para editar (route.params.id).
export const RegistrarPressao = ({ navigation, route }) => {
  const { buscarMedicao, salvarMedicao } = React.useContext(GlobalContextPressao);
  const existente = route.params?.id ? buscarMedicao(route.params.id) : null;

  const [form, setForm] = React.useState(() =>
    existente
      ? {
          sistolica: String(existente.sistolica),
          diastolica: String(existente.diastolica),
          frequencia: existente.frequencia != null ? String(existente.frequencia) : "",
          data: formatarData(existente.data),
          hora: existente.hora,
          contexto: existente.contexto,
          braco: existente.braco,
          sintomas: existente.sintomas ?? [],
          observacoes: existente.observacoes ?? "",
        }
      : {
          sistolica: "",
          diastolica: "",
          frequencia: "",
          data: hojeTexto(),
          hora: agoraHora(),
          contexto: "",
          braco: "",
          sintomas: [],
          observacoes: "",
        }
  );
  const [erros, setErros] = React.useState({});
  const [salvando, setSalvando] = React.useState(false);
  // Valores fora do habitual não são bloqueados: pedimos só uma confirmação.
  const [confirmarIncomum, setConfirmarIncomum] = React.useState(false);

  const alterar = (campo) => (valor) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
    if (campo === "sistolica" || campo === "diastolica") setConfirmarIncomum(false);
  };

  const alternarSintoma = (valor) =>
    setForm((atual) => ({
      ...atual,
      sintomas: atual.sintomas.includes(valor)
        ? atual.sintomas.filter((s) => s !== valor)
        : [...atual.sintomas, valor],
    }));

  const validar = () => {
    const novos = {};
    const sistolica = validarNumero(form.sistolica, LIMITES.sistolica, "pressão sistólica");
    const diastolica = validarNumero(form.diastolica, LIMITES.diastolica, "pressão diastólica");
    const frequencia = validarNumero(form.frequencia, LIMITES.frequencia, "frequência", false);
    if (sistolica) novos.sistolica = sistolica;
    if (diastolica) novos.diastolica = diastolica;
    if (frequencia) novos.frequencia = frequencia;
    if (!sistolica && !diastolica && Number(form.diastolica) >= Number(form.sistolica))
      novos.diastolica = "A diastólica (mínima) precisa ser menor que a sistólica (máxima). Confira se não inverteu.";

    const dataIso = dataParaIso(form.data);
    if (!form.data) novos.data = "Informe a data da medição.";
    else if (!dataIso) novos.data = "Data inválida. Use DD/MM/AAAA e não use datas futuras.";
    if (!form.hora) novos.hora = "Informe o horário.";
    else if (!horaValida(form.hora)) novos.hora = "Horário inválido. Use HH:MM (ex.: 07:30).";
    else if (dataIso) {
      const [ano, mes, dia] = dataIso.split("-").map(Number);
      const [h, m] = form.hora.split(":").map(Number);
      if (new Date(ano, mes - 1, dia, h, m) > new Date()) novos.hora = "Esse horário ainda não chegou.";
    }
    if (!form.contexto) novos.contexto = "Escolha o contexto da medição.";
    if (!form.braco) novos.braco = "Escolha o braço usado.";
    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const salvar = async () => {
    if (salvando || !validar()) return;
    const sistolica = Number(form.sistolica);
    const diastolica = Number(form.diastolica);
    if (valorIncomum(sistolica, diastolica) && !confirmarIncomum) {
      setConfirmarIncomum(true);
      return;
    }
    setSalvando(true);
    const salva = await salvarMedicao({
      ...(existente ? { id: existente.id } : {}),
      sistolica,
      diastolica,
      frequencia: form.frequencia ? Number(form.frequencia) : null,
      data: dataParaIso(form.data),
      hora: form.hora,
      contexto: form.contexto,
      braco: form.braco,
      sintomas: form.sintomas,
      observacoes: form.observacoes.trim(),
    });
    setSalvando(false);
    if (!salva) return;
    if (existente) navigation.goBack();
    else navigation.replace("DetalhePressao", { id: salva.id, nova: true });
  };

  const temErros = Object.values(erros).some(Boolean);

  return (
    <View style={styles.container}>
      <Header titulo={existente ? "Editar medição" : "Registrar pressão"} voltar />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>{existente ? "EDITAR" : "NOVA MEDIÇÃO"}</Text>
          <Text style={styles.titulo}>{existente ? "Editar medição" : "Registrar pressão arterial"}</Text>
          <Text style={styles.subtitulo}>
            Campos com <Text style={styles.obrigatorio}>*</Text> são obrigatórios.
          </Text>

          <View style={styles.botoesLinha}>
            <View style={styles.botaoMetade}>
              <Campo
                rotulo="Sistólica / máxima (mmHg)"
                obrigatorio
                placeholder="Ex.: 120"
                keyboardType="number-pad"
                value={form.sistolica}
                onChangeText={(t) => alterar("sistolica")(somenteNumeros(t))}
                erro={erros.sistolica}
                maxLength={3}
              />
            </View>
            <View style={styles.botaoMetade}>
              <Campo
                rotulo="Diastólica / mínima (mmHg)"
                obrigatorio
                placeholder="Ex.: 80"
                keyboardType="number-pad"
                value={form.diastolica}
                onChangeText={(t) => alterar("diastolica")(somenteNumeros(t))}
                erro={erros.diastolica}
                maxLength={3}
              />
            </View>
          </View>

          <Campo
            rotulo="Frequência cardíaca (bpm)"
            placeholder="Opcional. Ex.: 72"
            keyboardType="number-pad"
            value={form.frequencia}
            onChangeText={(t) => alterar("frequencia")(somenteNumeros(t))}
            erro={erros.frequencia}
            maxLength={3}
          />

          <View style={styles.botoesLinha}>
            <View style={styles.botaoMetade}>
              <Campo
                rotulo="Data"
                obrigatorio
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                value={form.data}
                onChangeText={(t) => alterar("data")(mascaraData(t))}
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
                onChangeText={(t) => alterar("hora")(mascaraHora(t))}
                erro={erros.hora}
                maxLength={5}
              />
            </View>
          </View>

          <SeletorOpcoes
            rotulo="Contexto da medição"
            obrigatorio
            opcoes={CONTEXTOS}
            valor={form.contexto}
            onChange={alterar("contexto")}
            erro={erros.contexto}
          />

          <SeletorOpcoes
            rotulo="Braço utilizado"
            obrigatorio
            opcoes={BRACOS}
            valor={form.braco}
            onChange={alterar("braco")}
            erro={erros.braco}
          />

          <View style={styles.campo}>
            <Text style={styles.rotulo}>Sintomas no momento da medição</Text>
            <Text style={[styles.legenda, { marginBottom: 8 }]}>Marque se sentiu algum destes. Opcional.</Text>
            <View style={styles.opcoes}>
              {SINTOMAS.map((sintoma) => {
                const ativo = form.sintomas.includes(sintoma.valor);
                return (
                  <Pressable
                    key={sintoma.valor}
                    onPress={() => alternarSintoma(sintoma.valor)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: ativo }}
                    style={({ pressed }) => [styles.filtro, ativo && styles.filtroAtivo, pressed && styles.pressionado]}
                  >
                    <Text style={[styles.filtroTexto, ativo && styles.filtroTextoAtivo]}>{sintoma.rotulo}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Campo
            rotulo="Observações"
            multiline
            placeholder="Ex.: medi depois de subir escadas, esqueci o remédio, estava nervoso…"
            value={form.observacoes}
            onChangeText={alterar("observacoes")}
            maxLength={400}
          />

          {temErros && <Aviso erro texto="Confira os campos destacados antes de salvar." />}
          {confirmarIncomum && !temErros && (
            <Aviso
              erro
              texto={`${form.sistolica}/${form.diastolica} mmHg está fora dos valores habituais. Confira se digitou certo. Se o valor estiver correto, toque em "Confirmar e registrar": ele será salvo normalmente.`}
            />
          )}

          <Botao
            texto={
              salvando
                ? "Salvando…"
                : confirmarIncomum
                  ? "Confirmar e registrar"
                  : existente
                    ? "Salvar alterações"
                    : "Registrar medição"
            }
            onPress={salvar}
            desativado={salvando}
          />
          <Botao texto="Cancelar" variante="secundario" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </View>
  );
};
