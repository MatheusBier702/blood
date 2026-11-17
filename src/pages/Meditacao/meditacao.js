import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../screen/components/Header";
import { styles } from "../../screen/css/MeditacaoStyle";
import { SonsNaturais } from "./SonsNaturais/SonsNaturais";

export const Meditacao = () => {
  return (
    <View style={styles.container}>
      <Header titulo="Meditação" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>MEDITAÇÃO</Text>
          <Text style={styles.titulo}>Um momento para respirar</Text>
          <Text style={styles.subtitulo}>
            Sente-se confortavelmente, respire devagar e deixe o som da natureza acompanhar você.
          </Text>

          <SonsNaturais />
        </View>
      </ScrollView>
    </View>
  );
};
