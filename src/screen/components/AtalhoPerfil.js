import React from "react";
import { Pressable, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../css/AtalhoPerfilStyle";

export const AtalhoPerfil = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate("Perfil")}
      accessibilityRole="button"
      accessibilityLabel="Abrir meu perfil"
      style={({ pressed }) => [styles.atalho, pressed && styles.pressionado]}
    >
      <View style={styles.icone} accessible={false}>
        <View style={styles.cabeca} />
        <View style={styles.corpo} />
      </View>
    </Pressable>
  );
};
