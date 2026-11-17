import React from "react";
import { Linking, Pressable, Text, View } from "react-native";
import { styles } from "../../../screen/css/PressaoStyle";
import { Chip } from "../../Alergias/Componentes/Componentes";
import {
  TIPOS_ALERTA,
  alertaDaMedicao,
  formatarDataHora,
  formatarFrequencia,
  formatarPressao,
  rotuloBraco,
  rotuloContexto,
} from "../dadosPressao";

export const EtiquetaAlerta = ({ tipo }) => {
  const info = TIPOS_ALERTA[tipo];
  if (!info) return null;
  return (
    <View style={[styles.chip, { backgroundColor: info.fundo }]}>
      <Text style={[styles.chipTexto, { color: info.texto }]}>{info.rotulo}</Text>
    </View>
  );
};

// Faixa vermelha de orientação para atendimento imediato.
export const OrientacaoEmergencia = ({ texto }) => (
  <View style={styles.emergencia} accessibilityRole="alert">
    <Text style={styles.emergenciaTitulo}>Procure atendimento médico imediato</Text>
    <Text style={styles.emergenciaTexto}>{texto || TIPOS_ALERTA.urgente.orientacao}</Text>
    <Pressable
      onPress={() => Linking.openURL("tel:192").catch(() => {})}
      accessibilityRole="button"
      style={({ pressed }) => [styles.emergenciaBotao, pressed && styles.pressionado]}
    >
      <Text style={styles.emergenciaBotaoTexto}>Ligar 192 (SAMU)</Text>
    </Pressable>
  </View>
);

// Cartão de uma medição nas listas (visão geral e histórico).
export const CardPressao = ({ medicao, metas, onPress, mostrarData = true }) => {
  const alerta = alertaDaMedicao(medicao, metas);
  const frequencia = formatarFrequencia(medicao);
  return (
    <Pressable
      onPress={() => onPress(medicao)}
      accessibilityRole="button"
      accessibilityLabel={`${formatarPressao(medicao)} mmHg, ${formatarDataHora(medicao)}`}
      style={({ pressed }) => [styles.card, alerta && alerta !== "fora_meta" && styles.cardGrave, pressed && styles.pressionado]}
    >
      <View style={[styles.valorCaixa, styles.valorCaixaPressao]}>
        <Text style={styles.valorPressao}>{formatarPressao(medicao)}</Text>
        <Text style={styles.valorUnidade}>mmHg</Text>
      </View>
      <View style={styles.cardCorpo}>
        <Text style={styles.cardNome}>{rotuloContexto(medicao.contexto)}</Text>
        <Text style={styles.legenda}>{mostrarData ? formatarDataHora(medicao) : `Às ${medicao.hora}`}</Text>
        {!!medicao.observacoes && (
          <Text style={styles.cardTexto} numberOfLines={2}>
            {medicao.observacoes}
          </Text>
        )}
        <View style={styles.cardInfo}>
          {!!frequencia && <Chip texto={`FC ${frequencia}`} />}
          <Chip texto={`Braço ${rotuloBraco(medicao.braco).toLowerCase()}`} />
          {!!alerta && <EtiquetaAlerta tipo={alerta} />}
        </View>
      </View>
    </Pressable>
  );
};
