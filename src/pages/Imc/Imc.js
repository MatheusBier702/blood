import React from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "../../screen/components/Header";
import { styles } from "../../screen/css/ImcStyle";
import Resultado from "./Resultado/Resultado";
import CalculadoraIMC from "./CalculadoraIMC/CalculadoraIMC";

import { GlobalStorage } from "./ContextGlobal";

const Imc = () => {
  return (
    <GlobalStorage>
       <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.cabecalhoTexto}>
          <Text style={styles.titulo}>Calculadora de IMC</Text>
          <Text style={styles.subtitulo}>
            Descubra seu Índice de Massa Corporal
          </Text>
        </View>
        {/* Cartão de entrada de dados */}
        <CalculadoraIMC />
        {/* Cartão de resultado */}
        <Resultado />
      </ScrollView>
    </View>
    </GlobalStorage>
   
  );
};

export default Imc;
