import React from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import styles from "../../screen/css/ImcStyle";
import { GlobalContext } from "./ContextGlobal";
import Resultado from "./Resultado/Resultado";
import CalculadoraIMC from "./CalculadoraIMC/CalculadoraIMC";

const Imc = () => {
  const { altura, peso, imc, setAltura, setPeso, handleClick } =
    React.useContext(GlobalContext);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.cabecalhoTexto}>
          <Text style={styles.titulo}>Calculadora de IMC</Text>
          <Text style={styles.subtitulo}>
            Descubra seu índice de massa corporal.
          </Text>
        </View>

        {/* <View style={[styles.cartao, styles.cartaoEspaco]}>
          <View style={styles.alternador}>
            <View style={[styles.alternadorBotao, styles.alternadorBotaoAtivo]}>
              <Text
                style={[styles.alternadorTexto, styles.alternadorTextoAtivo]}
              >
                Métrico
              </Text>
            </View>
            <View style={styles.alternadorBotao}>
              <Text style={styles.alternadorTexto}>Fórmula</Text>
            </View>
          </View>

          <View style={styles.campo}>
            <View style={styles.campoCabecalho}>
              <Text style={styles.campoLabel}>Altura</Text>
              <Text style={styles.campoValor}>182 cm</Text>
            </View>
            <TextInput
              style={styles.inputNormal}
              value={altura}
              keyboardType="numeric"
              onChangeText={setAltura}
            />
          </View>

          <View style={styles.campo}>
            <View style={styles.campoCabecalho}>
              <Text style={styles.campoLabel}>Peso</Text>
              <Text style={styles.campoValor}>77 kg</Text>
            </View>
            <TextInput
              style={styles.inputNormal}
              value={peso}
              keyboardType="numeric"
              onChangeText={setPeso}
            />
          </View>

          <View style={[styles.campo, { marginBottom: 8 }]}>
            <View style={styles.campoCabecalho}>
              <Text style={styles.campoLabel}>Idade</Text>
            </View>

            <View style={styles.seletor}>
              <View style={styles.seletorBotao}>
                <Text style={styles.seletorBotaoTexto}>–</Text>
              </View>
              <View style={styles.seletorValorArea}>
                <Text style={styles.seletorValor}>24</Text>
                <Text style={styles.seletorUnidade}>anos</Text>
              </View>
              <View style={styles.seletorBotao}>
                <Text style={styles.seletorBotaoTexto}>+</Text>
              </View>
            </View>
          </View>

          <Pressable style={styles.botaoCalcular} onPress={handleClick}>
            <Text style={styles.botaoCalcularTexto}>CALCULAR IMC</Text>
          </Pressable>
        </View> */}
        <CalculadoraIMC />

        <Resultado />
      </ScrollView>
    </View>
  );
};

export default Imc;
