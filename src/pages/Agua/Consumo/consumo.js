import React from "react";
import { View, Pressable, Text } from "react-native";
import { styles } from "../../../screen/css/ConsumoStyle";

export const Consumo = ({
  consumido = 0,
  objetivo = 2000,
  lembrete = "--:--",
  falta = "",
}) => {
  const porcentagem = objetivo > 0 ? Math.round((consumido / objetivo) * 100) : 0;

  return (
    <View style={styles.container}>
      {/* quantidade bebida hoje */}
      <View style={styles.totalArea}>
        <Text style={styles.totalValor}>{consumido}</Text>
        <Text style={styles.totalUnidade}>ml</Text>
      </View>

      <View style={styles.cardsLinha}>
        {/* objetivo */}
        <View style={styles.card}>
          <View style={styles.cardCabecalho}>
            <View style={[styles.cardBarra, styles.cardBarraObjetivo]} />
            <Text style={styles.cardTitulo}>Objetivo</Text>
          </View>

          <View style={styles.cardValorLinha}>
            <Text style={styles.cardValor}>{objetivo}ml</Text>
            <Text style={styles.cardValorSecundario}>({porcentagem}%)</Text>
            <Pressable style={styles.botaoEditar}>
              <Text style={styles.botaoEditarGlifo}>✎</Text>
            </Pressable>
          </View>
        </View>

        {/* próximo lembrete */}
        <View style={styles.card}>
          <View style={styles.cardCabecalho}>
            <View style={[styles.cardBarra, styles.cardBarraLembrete]} />
            <Text style={styles.cardTitulo}>Próximo lembrete</Text>
          </View>

          <View style={styles.cardValorLinha}>
            <Text style={styles.cardValor}>{lembrete}</Text>
            {falta ? (
              <Text style={styles.cardValorSecundario}>(Falta {falta})</Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};
