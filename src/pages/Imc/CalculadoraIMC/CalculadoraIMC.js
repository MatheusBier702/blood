import React from "react";
import { View, Image, Text, TextInput, Pressable } from "react-native";
import { styles } from "../../../screen/css/ImcStyle";
import Formula from "../Formula/Formula";

const balancaIcon = require("../../../screen/assets/balanca.png");
const idadeIcon = require("../../../screen/assets/idade.png");
const kiloIcon = require("../../../screen/assets/kilo.png");
const formulaIcon = require("../../../screen/assets/formula.png");
const alturaIcon = require("../../../screen/assets/altura.png");
import { GlobalContext } from "../ContextGlobal";

const CalculadoraIMC = () => {
  const {
    altura,
    setAltura,
    peso,
    setPeso,
    handleClick,
    handleContadorIdade,
    contador,
  } = React.useContext(GlobalContext);

  // Aba visível: "metrico" (formulário) ou "formula" (explicação + tabela)
  const [aba, setAba] = React.useState("metrico");

  return (
    <View style={[styles.cartao, styles.cartaoEspaco]}>
      {/* Alternador Métrico / Fórmula */}
      <View style={styles.alternador}>
        <Pressable
          style={[
            styles.alternadorBotao,
            aba === "metrico" && styles.alternadorBotaoAtivo,
          ]}
          onPress={() => setAba("metrico")}
        >
          <Image source={balancaIcon} style={styles.alternadorIconeImagem} />
          <Text
            style={[
              styles.alternadorTexto,
              aba === "metrico" && styles.alternadorTextoAtivo,
            ]}
          >
            Métrico
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.alternadorBotao,
            aba === "formula" && styles.alternadorBotaoAtivo,
          ]}
          onPress={() => setAba("formula")}
        >
          <Image source={formulaIcon} style={styles.alternadorIconeImagem} />
          <Text
            style={[
              styles.alternadorTexto,
              aba === "formula" && styles.alternadorTextoAtivo,
            ]}
          >
            Fórmula
          </Text>
        </Pressable>
      </View>

      {aba === "formula" ? (
        <Formula />
      ) : (
        <View>
          {/* Altura */}
          <View style={styles.campo}>
            <View style={styles.campoCabecalho}>
              <View style={styles.campoLabelArea}>
                <View style={styles.campoIconeCirculo}>
                  <Image source={alturaIcon} style={styles.campoIconeImagem} />
                </View>
                <Text style={styles.campoLabel}>Altura</Text>
              </View>
              <Text style={styles.campoValor}>182 cm</Text>
            </View>

            <TextInput
              style={styles.inputNormal}
              defaultValue="182"
              keyboardType="numeric"
              value={altura}
              onChangeText={setAltura}
            />
          </View>

          {/* Peso */}
          <View style={styles.campo}>
            <View style={styles.campoCabecalho}>
              <View style={styles.campoLabelArea}>
                <View style={styles.campoIconeCirculo}>
                  <Image source={kiloIcon} style={styles.campoIconeImagem} />
                </View>
                <Text style={styles.campoLabel}>Peso</Text>
              </View>
              <Text style={styles.campoValor}>77 kg</Text>
            </View>

            <TextInput
              style={styles.inputNormal}
              defaultValue="77"
              keyboardType="numeric"
              value={peso}
              onChangeText={setPeso}
            />
          </View>

          {/* Idade */}
          <View style={[styles.campo, { marginBottom: 8 }]}>
            <View style={styles.campoCabecalho}>
              <View style={styles.campoLabelArea}>
                <View style={styles.campoIconeCirculo}>
                  <Image source={idadeIcon} style={styles.campoIconeImagem} />
                </View>
                <Text style={styles.campoLabel}>Idade</Text>
              </View>
            </View>

            <View style={styles.seletor}>
              <View style={styles.seletorBotao}>
                <Pressable onPress={() => handleContadorIdade("-")}>
                  <Text style={styles.seletorBotaoTexto}>–</Text>
                </Pressable>
              </View>

              <View style={styles.seletorValorArea}>
                <Text style={styles.seletorValor}>{contador}</Text>
                <Text style={styles.seletorUnidade}>anos</Text>
              </View>

              <View style={styles.seletorBotao}>
                <Pressable onPress={() => handleContadorIdade("+")}>
                  <Text style={styles.seletorBotaoTexto}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.botaoCalcular}>
            <Pressable onPress={handleClick}>
              <Text style={styles.botaoCalcularTexto}>CALCULAR IMC</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default CalculadoraIMC;
