import React, { useState } from "react";
import { View, Pressable, Text, ScrollView, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Header from "../../screen/components/Header";
import { TIPOS_SANGUINEOS, tipoSanguineoValido } from "./compatibilidade";

export const Sangue = ({ navigation }) => {
  const [tipoSangue, setTipoSangue] = useState("");
  const valido = tipoSanguineoValido(tipoSangue);

  const proximo = () => {
    if (valido) navigation.navigate("InicialSangue", { tipoSangue });
  };

  return (
    <View style={styles.pagina}>
      <Header titulo="Sangue" voltar />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.card}>
          <Text style={styles.selo}>COMPATIBILIDADE SANGUÍNEA</Text>
          <Text style={styles.titulo}>Qual é o seu tipo sanguíneo?</Text>
          <Text style={styles.descricao}>
            Informe seu tipo para descobrir de quem você pode receber e para
            quem pode doar hemácias.
          </Text>
          <Text style={styles.rotulo}>Seu tipo sanguíneo</Text>
          <View style={styles.seletor}>
            <Picker
              selectedValue={tipoSangue}
              onValueChange={setTipoSangue}
              accessibilityLabel="Seu tipo sanguíneo"
              style={styles.picker}
            >
              <Picker.Item label="Selecione seu tipo sanguíneo" value="" />
              {TIPOS_SANGUINEOS.map((tipo) => (
                <Picker.Item key={tipo} label={tipo} value={tipo} />
              ))}
            </Picker>
          </View>
          <Text style={styles.ajuda}>
            {valido
              ? `Tipo ${tipoSangue} selecionado.`
              : "Selecione um tipo para continuar."}
          </Text>
          <Pressable
            onPress={proximo}
            disabled={!valido}
            accessibilityRole="button"
            accessibilityState={{ disabled: !valido }}
            style={({ pressed }) => [
              styles.botao,
              !valido && styles.desabilitado,
              pressed && styles.pressionado,
            ]}
          >
            <Text style={styles.botaoTexto}>Ver compatibilidade</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  pagina: {
    flex: 1,
    backgroundColor: "#F2F6F3",
  },
  conteudo: {
    padding: 20,
    flexGrow: 1,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 640,
    padding: 24,
    backgroundColor: "#FFF",
    borderRadius: 24,
    gap: 16,
  },
  selo: {
    color: "#B4233C",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  titulo: {
    color: "#23352B",
    fontSize: 28,
    fontWeight: "700",
  },
  descricao: {
    color: "#617068",
    fontSize: 16,
    lineHeight: 24,
  },
  rotulo: {
    color: "#23352B",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  seletor: {
    borderWidth: 1,
    borderColor: "#D5DFD8",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    color: "#23352B",
    width: "100%",
  },
  ajuda: {
    color: "#617068",
    fontSize: 13,
  },
  botao: {
    backgroundColor: "#B4233C",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  desabilitado: {
    backgroundColor: "#929D96",
  },
  pressionado: {
    opacity: 0.8,
  },
});
