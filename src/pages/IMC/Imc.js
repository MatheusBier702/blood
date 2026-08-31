import React from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import styles from "../../screen/css/ImcStyle";
import { GlobalContext } from "./ContextGlobal";
import Resultado from "./Resultado/Resultado";
import CalculadoraIMC from "./CalculadoraIMC/CalculadoraIMC";
import Header from "../../screen/components/Header";

const Imc = () => {
  const { altura, peso, imc, setAltura, setPeso, handleClick } =
    React.useContext(GlobalContext);
  return (
    <View style={styles.container}>
      <Header titulo="IMC" voltar />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.cabecalhoTexto}>
          <Text style={styles.titulo}>Calculadora de IMC</Text>
          <Text style={styles.subtitulo}>
            Descubra seu índice de massa corporal.
          </Text>
        </View>

        <CalculadoraIMC />
        <Resultado />
      </ScrollView>
    </View>
  );
};

export default Imc;
