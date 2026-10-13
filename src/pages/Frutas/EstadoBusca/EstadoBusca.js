import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/FrutasStyle";

export const EstadoBusca = ({ carregando, erro }) => (
  <>
    {carregando && (
      <View style={styles.estado} accessibilityLiveRegion="polite">
        <ActivityIndicator color={color.colorModelFour} />
        <Text style={styles.subtitulo}>Frutando</Text>
      </View>
    )}
    {!!erro && (
      <View style={styles.aviso} accessibilityLiveRegion="polite">
        <Text style={styles.avisoTexto}>{erro}</Text>
      </View>
    )}
  </>
);
