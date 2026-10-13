import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import color from "../../../screen/Colors/cor";
import { styles } from "../../../screen/css/FrutasStyle";

export const BuscaFruta = ({ fruta, setFruta, buscar }) => (
  <View>
    <Text style={styles.etiqueta}>FRUTAS</Text>
    <Text style={styles.titulo}>Digite o nome da fruta</Text>
    <Text style={styles.subtitulo}>Informacoes sobre a fruta</Text>
    <View style={styles.busca}>
      <View style={styles.iconeBusca} accessible={false}>
        <View style={styles.lupa} />
        <View style={styles.cabo} />
      </View>
      <TextInput
        placeholder="qual o nome da fruta"
        placeholderTextColor={color.textoSuave}
        accessibilityLabel="nome fruta"
        value={fruta}
        onChangeText={setFruta}
        onSubmitEditing={() => buscar()}
        returnKeyType="search"
        autoCapitalize="none"
        style={styles.input}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Search for a fruit"
        onPress={() => buscar()}
        style={({ pressed }) => [
          styles.botaoBusca,
          pressed && styles.pressionado,
        ]}
      >
        <Text style={styles.botaoTexto}>Buscar</Text>
      </Pressable>
    </View>
  </View>
);
