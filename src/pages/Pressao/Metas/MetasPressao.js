import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/PressaoStyle";
import { GlobalContextPressao } from "../GlobalContextPressao";
import { Aviso, Botao, Campo, CampoDetalhe, Confirmacao, Vazio } from "../../Alergias/Componentes/Componentes";
import {
  LIMITES,
  dataParaIso,
  descreverMeta,
  formatarData,
  hojeTexto,
  mascaraData,
  temMetas,
} from "../dadosPressao";

// Metas individuais definidas pelo profissional de saúde. O app não sugere nem
// preenche valores: a pessoa só copia o que foi combinado na consulta.

const campoTexto = (valor) => (valor != null ? String(valor) : "");
const somenteNumeros = (t) => t.replace(/[^\d]/g, "").slice(0, 3);

export const MetasPressao = () => {
  const { metas, salvarMetas } = React.useContext(GlobalContextPressao);
  const [editando, setEditando] = React.useState(false);
  const [removendo, setRemovendo] = React.useState(false);
  const [form, setForm] = React.useState({});
  const [erros, setErros] = React.useState({});
  const [mensagem, setMensagem] = React.useState("");

  const abrirEdicao = () => {
    setForm({
      sisMin: campoTexto(metas.sistolica?.minimo),
      sisMax: campoTexto(metas.sistolica?.maximo),
      diaMin: campoTexto(metas.diastolica?.minimo),
      diaMax: campoTexto(metas.diastolica?.maximo),
      profissional: metas.profissional ?? "",
      definidaEm: metas.definidaEm ? formatarData(metas.definidaEm) : hojeTexto(),
    });
    setErros({});
    setMensagem("");
    setEditando(true);
  };

  const alterar = (campo, numerico = true) => (texto) => {
    setForm((f) => ({ ...f, [campo]: numerico ? somenteNumeros(texto) : texto }));
    setErros((e) => ({ ...e, [campo]: undefined, geral: undefined }));
  };

  const salvar = async () => {
    const novos = {};
    const ler = (campo, limites) => {
      if (!form[campo]) return null;
      const v = Number(form[campo]);
      if (v < limites.minimo || v > limites.maximo) novos[campo] = `Entre ${limites.minimo} e ${limites.maximo}.`;
      return v;
    };
    const sisMin = ler("sisMin", LIMITES.sistolica);
    const sisMax = ler("sisMax", LIMITES.sistolica);
    const diaMin = ler("diaMin", LIMITES.diastolica);
    const diaMax = ler("diaMax", LIMITES.diastolica);
    if (sisMin != null && sisMax != null && sisMin >= sisMax) novos.sisMax = "Precisa ser maior que o mínimo.";
    if (diaMin != null && diaMax != null && diaMin >= diaMax) novos.diaMax = "Precisa ser maior que o mínimo.";
    if ([sisMin, sisMax, diaMin, diaMax].every((v) => v == null))
      novos.geral = "Preencha pelo menos um valor de meta.";
    const definidaEm = form.definidaEm ? dataParaIso(form.definidaEm) : null;
    if (form.definidaEm && !definidaEm) novos.definidaEm = "Data inválida (DD/MM/AAAA, sem datas futuras).";
    setErros(novos);
    if (Object.keys(novos).length) return;

    const ok = await salvarMetas({
      sistolica: { minimo: sisMin, maximo: sisMax },
      diastolica: { minimo: diaMin, maximo: diaMax },
      profissional: form.profissional.trim(),
      definidaEm,
    });
    if (ok) {
      setEditando(false);
      setMensagem("Metas salvas.");
    }
  };

  const remover = async () => {
    setRemovendo(false);
    const ok = await salvarMetas({});
    if (ok) setMensagem("Metas removidas.");
  };

  const definidas = temMetas(metas);

  return (
    <View style={styles.container}>
      <Header titulo="Metas" voltar />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>METAS E ACOMPANHAMENTO</Text>
          <Text style={styles.titulo}>Suas metas de pressão</Text>
          <Text style={styles.subtitulo}>
            As metas são individuais. Cadastre apenas os valores definidos pelo seu profissional de saúde.
          </Text>

          {!!mensagem && <Aviso texto={mensagem} />}

          {editando ? (
            <>
              <Text style={[styles.secao, { marginTop: 22 }]}>Sistólica (máxima)</Text>
              <View style={styles.botoesLinha}>
                <View style={styles.botaoMetade}>
                  <Campo rotulo="Mínimo (mmHg)" placeholder="—" keyboardType="number-pad" value={form.sisMin} onChangeText={alterar("sisMin")} erro={erros.sisMin} maxLength={3} />
                </View>
                <View style={styles.botaoMetade}>
                  <Campo rotulo="Máximo (mmHg)" placeholder="—" keyboardType="number-pad" value={form.sisMax} onChangeText={alterar("sisMax")} erro={erros.sisMax} maxLength={3} />
                </View>
              </View>

              <Text style={[styles.secao, { marginTop: 22 }]}>Diastólica (mínima)</Text>
              <View style={styles.botoesLinha}>
                <View style={styles.botaoMetade}>
                  <Campo rotulo="Mínimo (mmHg)" placeholder="—" keyboardType="number-pad" value={form.diaMin} onChangeText={alterar("diaMin")} erro={erros.diaMin} maxLength={3} />
                </View>
                <View style={styles.botaoMetade}>
                  <Campo rotulo="Máximo (mmHg)" placeholder="—" keyboardType="number-pad" value={form.diaMax} onChangeText={alterar("diaMax")} erro={erros.diaMax} maxLength={3} />
                </View>
              </View>
              <Text style={[styles.legenda, { marginTop: 6 }]}>Você pode preencher só o máximo, só o mínimo ou os dois.</Text>

              <Campo
                rotulo="Definidas por"
                placeholder="Ex.: Dra. Ana (cardiologista)"
                value={form.profissional}
                onChangeText={alterar("profissional", false)}
                maxLength={80}
              />
              <Campo
                rotulo="Data em que foram definidas"
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                value={form.definidaEm}
                onChangeText={(t) => alterar("definidaEm", false)(mascaraData(t))}
                erro={erros.definidaEm}
                maxLength={10}
              />

              {!!erros.geral && <Aviso erro texto={erros.geral} />}
              <Botao texto="Salvar metas" onPress={salvar} />
              <Botao texto="Cancelar" variante="secundario" onPress={() => setEditando(false)} />
            </>
          ) : definidas ? (
            <>
              <View style={styles.painel}>
                <CampoDetalhe rotulo="Meta sistólica (máxima)" valor={descreverMeta(metas.sistolica)} />
                <CampoDetalhe rotulo="Meta diastólica (mínima)" valor={descreverMeta(metas.diastolica)} />
                <CampoDetalhe rotulo="Definidas por" valor={metas.profissional} />
                <CampoDetalhe rotulo="Data" valor={metas.definidaEm ? formatarData(metas.definidaEm) : ""} ultimo />
              </View>
              <Text style={[styles.legenda, { marginTop: 10 }]}>
                As medições fora dessas metas aparecem em Alertas e no gráfico (linha pontilhada da meta máxima).
              </Text>
              <Botao texto="Editar metas" onPress={abrirEdicao} />
              <Botao texto="Remover metas" variante="perigo" onPress={() => setRemovendo(true)} />
            </>
          ) : (
            <View style={{ marginTop: 18 }}>
              <Vazio
                texto="Nenhuma meta cadastrada. Quando seu profissional de saúde definir suas metas de pressão, cadastre-as aqui para acompanhar as medições fora delas."
                rotuloAcao="Cadastrar metas"
                acao={abrirEdicao}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <Confirmacao
        visivel={removendo}
        titulo="Remover metas?"
        texto="As metas de pressão serão apagadas. Suas medições continuam salvas."
        rotuloConfirmar="Remover"
        onConfirmar={remover}
        onCancelar={() => setRemovendo(false)}
      />
    </View>
  );
};
