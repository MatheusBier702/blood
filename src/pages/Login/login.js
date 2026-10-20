import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormularioLogin } from "./Formulario/FormularioLogin";
import { styles } from "../../screen/css/LoginStyle";

export default function Login({ navigation }) {
  const entrar = () => navigation.reset({ index: 0, routes: [{ name: "Home" }] });

  return (
    <SafeAreaView style={styles.pagina}>
      <KeyboardAvoidingView style={styles.pagina}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <View style={styles.cartao}>
            <Text style={styles.marca}>BLOOD</Text>
            <Text style={styles.titulo}>Bem-vindo!</Text>
          
            <FormularioLogin onEntrar={entrar} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
