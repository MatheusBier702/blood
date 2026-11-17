import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../../../screen/css/AlergiasStyle";
import { Chip, EtiquetaGravidade } from "../Componentes/Componentes";
import { formatarData, rotuloCategoria, rotuloSituacao } from "../dadosAlergias";

// Cartão resumido de uma alergia (mesmo formato dos cartões da aba UBS).
// O marcador redondo mostra a inicial da substância; fica vermelho nas graves.
export const CardAlergia = ({ alergia, onPress, mostrarCategoria = true }) => {
  const grave = alergia.gravidade === "grave";

  return (
    <Pressable
      onPress={() => onPress(alergia)}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${alergia.substancia}`}
      style={({ pressed }) => [styles.card, grave && styles.cardGrave, pressed && styles.pressionado]}
    >
      <View style={[styles.marcador, grave && styles.marcadorGrave]}>
        <Text style={styles.marcadorTexto}>{grave ? "!" : alergia.substancia.charAt(0).toUpperCase()}</Text>
      </View>

      <View style={styles.cardCorpo}>
        <Text style={styles.cardNome}>{alergia.substancia}</Text>
        {!!alergia.sintomas && (
          <Text style={styles.cardTexto} numberOfLines={2}>
            {alergia.sintomas}
          </Text>
        )}
        <View style={styles.cardInfo}>
          <EtiquetaGravidade gravidade={alergia.gravidade} />
          {mostrarCategoria && <Chip texto={rotuloCategoria(alergia.categoria)} />}
          <Chip texto={rotuloSituacao(alergia.situacao)} />
        </View>
        <Text style={[styles.legenda, { marginTop: 8 }]}>
          Última reação: {formatarData(alergia.ultimaReacao)}
        </Text>
      </View>
    </Pressable>
  );
};
