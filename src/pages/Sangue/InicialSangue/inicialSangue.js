import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Header from "../../../screen/components/Header";
import { Dashboard } from "./components/dashboard";

export const inicialSangue = ({ route, navigation }) => (
  <View style={styles.pagina}>
    <Header titulo="Sangue" voltar />
    <ScrollView contentContainerStyle={styles.conteudo}>
      <Dashboard
        tipoSangue={route?.params?.tipoSangue}
        onAlterarTipo={() => navigation.navigate("Sangue")}
      />
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  pagina: {
    flex: 1,
    backgroundColor: "#F2F6F3",
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
    flexGrow: 1,
  },
});
