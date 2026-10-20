import React from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "../../../screen/css/LoginStyle";

export const CampoLogin = ({ titulo, ...props }) => (
  <View style={styles.campo}>
    <Text style={styles.rotulo}>{titulo}</Text>
    <TextInput
      style={styles.input}
      accessibilityLabel={titulo}
      placeholderTextColor="#7C8B82"
      {...props}
    />
  </View>
);
