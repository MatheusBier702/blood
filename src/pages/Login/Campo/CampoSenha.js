import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { styles } from "../../../screen/css/LoginStyle";

export const CampoSenha = ({ value, onChangeText }) => {
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  return (
    <View style={styles.campo}>
      <Text style={styles.rotulo}>Senha</Text>
      <View style={styles.areaSenha}>
        <TextInput
          style={[styles.input, styles.inputSenha]}
          accessibilityLabel="Senha"
          placeholder="Sua senha"
          placeholderTextColor="#7C8B82"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!mostrarSenha}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          onPress={() => setMostrarSenha((atual) => !atual)}
          accessibilityRole="button"
          accessibilityLabel={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
          style={({ pressed }) => [styles.botaoVerSenha, pressed && styles.pressionado]}
        >
          <Text style={styles.textoVerSenha}>{mostrarSenha ? "Ocultar" : "Mostrar"}</Text>
        </Pressable>
      </View>
    </View>
  );
};
