import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../../../screen/css/VacinasStyle";
import { Chip } from "../../Alergias/Componentes/Componentes";
import { VACINAS } from "../calendarioVacinas";
import { SITUACOES, dataParaIso } from "../situacaoVacinas";
import { formatarData } from "../../Alergias/dadosAlergias";

export const EtiquetaSituacao = ({ situacao }) => {
  const info = SITUACOES[situacao] ?? SITUACOES.nao_iniciada;
  return (
    <View style={[styles.chip, { backgroundColor: info.fundo }]}>
      <Text style={[styles.chipTexto, { color: info.texto }]}>{info.rotulo}</Text>
    </View>
  );
};

export const textoProxima = (calculo) => {
  if (!calculo?.proximaData) return null;
  if (calculo.proximaAtrasada) return `${calculo.proximaRotulo ?? "Próxima dose"}: o quanto antes`;
  return `${calculo.proximaRotulo ?? "Próxima dose"}: ${formatarData(dataParaIso(calculo.proximaData))}`;
};

// Cartão de uma recomendação do calendário (lista da faixa etária).
export const CardVacina = ({ recomendacao, calculo, onPress }) => {
  const vacina = VACINAS[recomendacao.vacina];
  const atrasada = calculo.situacao === "atrasada";
  const proxima = textoProxima(calculo);
  return (
    <Pressable
      onPress={() => onPress(recomendacao)}
      accessibilityRole="button"
      accessibilityLabel={`${vacina.nome}, ${SITUACOES[calculo.situacao].rotulo}`}
      style={({ pressed }) => [styles.card, atrasada && styles.cardGrave, pressed && styles.pressionado]}
    >
      <View style={[styles.marcador, atrasada && styles.marcadorGrave]}>
        <Text style={styles.marcadorTexto}>{atrasada ? "!" : vacina.nome.charAt(0)}</Text>
      </View>
      <View style={styles.cardCorpo}>
        <Text style={styles.cardNome}>{vacina.nome}</Text>
        <Text style={styles.cardTexto} numberOfLines={2}>
          {vacina.doencas}
        </Text>
        {recomendacao.tipo === "especial" && !!recomendacao.grupo && (
          <Text style={[styles.cardTexto, { fontWeight: "700" }]}>Para: {recomendacao.grupo}</Text>
        )}
        <Text style={styles.legenda}>
          {recomendacao.idade} · {recomendacao.doses}
        </Text>
        <View style={styles.cardInfo}>
          {recomendacao.tipo === "especial" && calculo.situacao === "nao_iniciada" ? (
            // Indicação específica sem registro: não mostramos como pendência de todos.
            <Chip texto="Indicação específica" />
          ) : (
            <EtiquetaSituacao situacao={calculo.situacao} />
          )}
          {!!calculo.ultima && <Chip texto={`Última: ${formatarData(calculo.ultima.data)}`} />}
          {!!proxima && <Chip texto={proxima} />}
        </View>
      </View>
    </Pressable>
  );
};
