import React from "react";
import { Text, Pressable } from "react-native";
import { styles } from "../../../screen/css/AddCopoStyle";

export const AddCopo = () => {
  return (
    <Pressable
      style={({ pressed }) => [styles.botao, pressed && styles.botaoPressionado]}
    >
      <Text style={styles.mais}>+</Text>
      <Text style={styles.texto}>BEBER</Text>
    </Pressable>
  );
};
