import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GlobalContext } from "../../IMC/ContextGlobal";

export default function DadosPerfil() {
  const { nome, contador, tipoSangue, altura, peso } = React.useContext(GlobalContext);
  const dados = [
    ["NOME", nome],
    ["IDADE", contador ? String(contador) : ""],
    ["TIPO SANGUÍNEO", tipoSangue],
    ["ALTURA", altura ? altura + " cm" : ""],
    ["PESO", peso ? peso + " kg" : ""],
  ];
  return (
    <View style={styles.container}>
      {dados.map(([titulo, valor]) => (
        <View key={titulo} style={styles.dado}>
          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.valor}>{valor || "Não informado"}</Text>
        </View>
      ))}
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 18,
    margin: 20,
    padding: 10,
  },

  dado: {
    width: '50%',
    padding: 15,
  },

  titulo: {
    fontSize: 11,
    color: '#667085',
    fontWeight: 'bold',
  },

  valor: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 5,
  },
});