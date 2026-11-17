import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/GlicemiaStyle";
import { GlobalContextGlicemia } from "../GlobalContextGlicemia";
import {
  Aviso,
  Botao,
  Campo,
  Cancelar,
  Confirmacao,
  JanelaModal,
  Link,
  Vazio,
} from "../../Alergias/Componentes/Componentes";
import { MOMENTOS_COM_META, VALOR_MAXIMO, VALOR_MINIMO, descreverMeta, temMeta } from "../dadosGlicemia";

// Metas individuais: o app não sugere nem preenche valores. O paciente cadastra
// as faixas combinadas com a equipe de saúde para cada momento da medição.

const lerNumero = (texto) => {
  const limpo = texto.trim();
  if (!limpo) return { vazio: true };
  if (!/^\d+$/.test(limpo)) return { invalido: true };
  return { valor: Number(limpo) };
};

const FormMeta = ({ momento, metaAtual, visivel, onFechar, onSalvar }) => {
  const [minimo, setMinimo] = React.useState("");
  const [maximo, setMaximo] = React.useState("");
  const [erros, setErros] = React.useState({});

  React.useEffect(() => {
    if (!visivel) return;
    setMinimo(metaAtual?.minimo != null ? String(metaAtual.minimo) : "");
    setMaximo(metaAtual?.maximo != null ? String(metaAtual.maximo) : "");
    setErros({});
  }, [visivel, metaAtual]);

  const salvar = () => {
    const novos = {};
    const min = lerNumero(minimo);
    const max = lerNumero(maximo);
    const foraDaFaixa = (n) => n < VALOR_MINIMO || n > VALOR_MAXIMO;
    if (min.invalido) novos.minimo = "Use apenas números inteiros.";
    else if (!min.vazio && foraDaFaixa(min.valor)) novos.minimo = `Entre ${VALOR_MINIMO} e ${VALOR_MAXIMO} mg/dL.`;
    if (max.invalido) novos.maximo = "Use apenas números inteiros.";
    else if (!max.vazio && foraDaFaixa(max.valor)) novos.maximo = `Entre ${VALOR_MINIMO} e ${VALOR_MAXIMO} mg/dL.`;
    if (min.vazio && max.vazio) novos.maximo = "Preencha pelo menos um dos valores.";
    if (!novos.minimo && !novos.maximo && min.valor != null && max.valor != null && min.valor >= max.valor)
      novos.maximo = "O valor máximo precisa ser maior que o mínimo.";
    setErros(novos);
    if (Object.keys(novos).length) return;
    onSalvar({ minimo: min.valor ?? null, maximo: max.valor ?? null });
  };

  return (
    <JanelaModal visivel={visivel} onFechar={onFechar} titulo={momento ? `Meta: ${momento.rotulo.toLowerCase()}` : ""}>
      <Text style={styles.modalTexto}>
        Use os valores combinados com seu médico ou equipe de saúde. Você pode preencher só o mínimo, só o máximo ou os
        dois.
      </Text>
      <View style={styles.botoesLinha}>
        <View style={styles.botaoMetade}>
          <Campo
            rotulo="Mínimo (mg/dL)"
            placeholder="—"
            keyboardType="number-pad"
            value={minimo}
            onChangeText={(t) => {
              setMinimo(t.replace(/[^\d]/g, "").slice(0, 3));
              setErros((e) => ({ ...e, minimo: undefined }));
            }}
            erro={erros.minimo}
            maxLength={3}
          />
        </View>
        <View style={styles.botaoMetade}>
          <Campo
            rotulo="Máximo (mg/dL)"
            placeholder="—"
            keyboardType="number-pad"
            value={maximo}
            onChangeText={(t) => {
              setMaximo(t.replace(/[^\d]/g, "").slice(0, 3));
              setErros((e) => ({ ...e, maximo: undefined }));
            }}
            erro={erros.maximo}
            maxLength={3}
          />
        </View>
      </View>
      <Botao texto="Salvar meta" onPress={salvar} />
      <Cancelar onPress={onFechar} />
    </JanelaModal>
  );
};

export const MetasGlicemia = () => {
  const { metas, salvarMetas } = React.useContext(GlobalContextGlicemia);
  const [editando, setEditando] = React.useState(null); // momento { valor, rotulo }
  const [removendo, setRemovendo] = React.useState(null);
  const [salvo, setSalvo] = React.useState("");

  const definidas = MOMENTOS_COM_META.filter((m) => temMeta(metas[m.valor]));

  const gravar = async (momento, meta) => {
    const novas = { ...metas };
    if (meta) novas[momento.valor] = meta;
    else delete novas[momento.valor];
    const ok = await salvarMetas(novas);
    if (ok) setSalvo(meta ? `Meta "${momento.rotulo}" salva.` : `Meta "${momento.rotulo}" removida.`);
  };

  return (
    <View style={styles.container}>
      <Header titulo="Metas" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>METAS GLICÊMICAS</Text>
          <Text style={styles.titulo}>Suas metas individuais</Text>
          <Text style={styles.subtitulo}>
            As metas mudam de pessoa para pessoa. Cadastre apenas os valores definidos com sua equipe de saúde.
          </Text>

          {definidas.length === 0 && (
            <View style={{ marginTop: 18 }}>
              <Vazio
                texto="Você ainda não cadastrou nenhuma meta. Sem metas, suas medições são registradas normalmente, mas não são comparadas com nenhuma faixa."
                rotuloAcao="Cadastrar primeira meta"
                acao={() => setEditando(MOMENTOS_COM_META[0])}
              />
            </View>
          )}

          {!!salvo && <Aviso texto={salvo} />}

          <View style={{ marginTop: 18 }}>
            {MOMENTOS_COM_META.map((momento) => {
              const meta = metas[momento.valor];
              const definida = temMeta(meta);
              return (
                <View key={momento.valor} style={styles.card}>
                  <View style={[styles.marcador, !definida && { backgroundColor: color.borda }]}>
                    <Text style={[styles.marcadorTexto, !definida && { color: color.textoSuave }]}>
                      {definida ? "✓" : "–"}
                    </Text>
                  </View>
                  <View style={styles.cardCorpo}>
                    <Text style={styles.cardNome}>Meta {momento.rotulo.toLowerCase()}</Text>
                    <Text style={definida ? styles.metaValor : styles.metaVazia}>{descreverMeta(meta)}</Text>
                    <View style={styles.cardAcoes}>
                      <Link
                        texto={definida ? "Editar" : "Definir meta"}
                        onPress={() => {
                          setSalvo("");
                          setEditando(momento);
                        }}
                      />
                      {definida && <Link texto="Remover" cor={color.vermelho} onPress={() => setRemovendo(momento)} />}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          <Text style={[styles.legenda, { marginTop: 8 }]}>
            As medições feitas em "outro momento" não são comparadas com metas.
          </Text>
        </View>
      </ScrollView>

      <FormMeta
        visivel={!!editando}
        momento={editando}
        metaAtual={editando ? metas[editando.valor] : null}
        onFechar={() => setEditando(null)}
        onSalvar={async (meta) => {
          const momento = editando;
          setEditando(null);
          await gravar(momento, meta);
        }}
      />

      <Confirmacao
        visivel={!!removendo}
        titulo="Remover meta?"
        texto={removendo ? `A meta "${removendo.rotulo}" será apagada. Suas medições continuam salvas.` : ""}
        rotuloConfirmar="Remover"
        onConfirmar={async () => {
          const momento = removendo;
          setRemovendo(null);
          await gravar(momento, null);
        }}
        onCancelar={() => setRemovendo(null)}
      />
    </View>
  );
};
