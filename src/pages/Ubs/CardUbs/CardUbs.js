import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../../../screen/css/UbsStyle";
import { formatarDistancia, formatarTempo, ligar } from "../formatar";

export const CardUbs = ({ unidade, numero, ativa, modo, onSelecionar }) => {
  const distancia = unidade.distanciaRotaKm ?? unidade.distanciaKm;
  const deslocamento = modo === "carro" ? "de carro" : "a pé";

  return (
    <Pressable
      onPress={() => onSelecionar(unidade.id)}
      style={({ pressed }) => [styles.card, ativa && styles.cardAtivo, pressed && styles.pressionado]}
      accessibilityRole="button"
      accessibilityLabel={`${unidade.nome}, ${formatarDistancia(distancia)}`}
    >
      <View style={[styles.numero, ativa && styles.numeroAtivo]}>
        <Text style={styles.numeroTexto}>{numero}</Text>
      </View>
      <View style={styles.cardCorpo}>
        <Text style={styles.cardNome}>{unidade.nome}</Text>
        {!!unidade.endereco && <Text style={styles.cardEndereco}>{unidade.endereco}</Text>}
        <View style={styles.cardInfo}>
          <View style={styles.chip}>
            <Text style={styles.chipTexto}>{formatarDistancia(distancia)}</Text>
          </View>
          {unidade.tempoMin != null && (
            <View style={styles.chip}>
              <Text style={styles.chipTexto}>
                {formatarTempo(unidade.tempoMin)} {deslocamento}
              </Text>
            </View>
          )}
        </View>
        {!!unidade.turno && <Text style={styles.cardEndereco}>{unidade.turno}</Text>}
        <View style={styles.cardAcoes}>
          <Text style={styles.link}>{ativa ? "Esconder rota" : "Traçar rota"}</Text>
          {!!unidade.telefone && (
            <Pressable onPress={() => ligar(unidade.telefone)} hitSlop={6} accessibilityRole="link">
              <Text style={styles.link}>Ligar {unidade.telefone}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};
