import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../../../screen/css/GlicemiaStyle";
import { SITUACAO_META, compararComMeta, formatarDataHora, rotuloMomento } from "../dadosGlicemia";

export const EtiquetaMeta = ({ medicao, metas }) => {
  const situacao = SITUACAO_META[compararComMeta(medicao, metas)];
  if (!situacao) return null;
  return (
    <View style={[styles.chip, { backgroundColor: situacao.fundo }]}>
      <Text style={[styles.chipTexto, { color: situacao.texto }]}>{situacao.rotulo}</Text>
    </View>
  );
};

// Cartão de uma medição nas listas (visão geral e histórico).
export const CardMedicao = ({ medicao, metas, onPress, mostrarData = true }) => (
  <Pressable
    onPress={() => onPress(medicao)}
    accessibilityRole="button"
    accessibilityLabel={`${medicao.valor} mg/dL, ${rotuloMomento(medicao.momento)}, ${formatarDataHora(medicao)}`}
    style={({ pressed }) => [styles.card, pressed && styles.pressionado]}
  >
    <View style={styles.valorCaixa}>
      <Text style={styles.valorNumero}>{medicao.valor}</Text>
      <Text style={styles.valorUnidade}>mg/dL</Text>
    </View>
    <View style={styles.cardCorpo}>
      <Text style={styles.cardNome}>{rotuloMomento(medicao.momento)}</Text>
      <Text style={styles.legenda}>{mostrarData ? formatarDataHora(medicao) : `Às ${medicao.hora}`}</Text>
      {!!medicao.observacoes && (
        <Text style={styles.cardTexto} numberOfLines={2}>
          {medicao.observacoes}
        </Text>
      )}
      {!!compararComMeta(medicao, metas) && (
        <View style={styles.cardInfo}>
          <EtiquetaMeta medicao={medicao} metas={metas} />
        </View>
      )}
    </View>
  </Pressable>
);
