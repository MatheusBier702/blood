import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../../screen/css/ImcStyle";
import { GlobalContext } from "../ContextGlobal";

// Cada faixa aponta para os estilos correspondentes e para a etiqueta
// que deve ficar destacada embaixo da barra (0 = Abaixo, 1 = Saudavel, 2 = Sobrepeso).
const TEMAS = {
  abaixo: {
    etiquetaAtiva: 0,
    selo: styles.seloAbaixo,
    seloTexto: styles.seloTextoAbaixo,
    valor: styles.valorAbaixo,
    etiqueta: styles.etiquetaTextoAtivaAbaixo,
  },
  saudavel: {
    etiquetaAtiva: 1,
    selo: styles.seloSaudavel,
    seloTexto: styles.seloTextoSaudavel,
    valor: styles.valorSaudavel,
    etiqueta: styles.etiquetaTextoAtivaSaudavel,
  },
  sobrepeso: {
    etiquetaAtiva: 2,
    selo: styles.seloSobrepeso,
    seloTexto: styles.seloTextoSobrepeso,
    valor: styles.valorSobrepeso,
    etiqueta: styles.etiquetaTextoAtivaSobrepeso,
  },
};

// Tabela oficial de classificacao do IMC
function classificar(valor) {
  if (valor < 18.5) return { rotulo: "Abaixo do peso", tema: "abaixo" };
  if (valor < 25) return { rotulo: "Peso adequado", tema: "saudavel" };
  if (valor < 30) return { rotulo: "Sobrepeso", tema: "sobrepeso" };
  if (valor < 35) return { rotulo: "Obesidade grau I", tema: "sobrepeso" };
  if (valor < 40) return { rotulo: "Obesidade grau II", tema: "sobrepeso" };
  return { rotulo: "Obesidade grau III", tema: "sobrepeso" };
}

// A barra tem 3 pedacos: 25% (abaixo) + 33% (saudavel) + 42% (sobrepeso).
// A conta abaixo converte o IMC em uma posicao de 0% a 100% dentro desses pedacos.
function posicaoDaSeta(valor) {
  if (valor <= 15) return 0;
  if (valor < 18.5) return ((valor - 15) / 3.5) * 25;
  if (valor < 25) return 25 + ((valor - 18.5) / 6.5) * 33;
  if (valor < 40) return 58 + ((valor - 25) / 15) * 42;
  return 100;
}

const Resultado = () => {
  const { imc } = React.useContext(GlobalContext);

  const valor = Number(imc);
  const calculado = valor > 0;

  const { rotulo, tema } = classificar(valor);
  const cores = TEMAS[tema];
  const posicao = posicaoDaSeta(valor);

  return (
    <View style={styles.cartao}>
      <Text style={styles.resultadoTitulo}>Seu resultado</Text>

      <View style={styles.medidorArea}>
        <View style={styles.medidorTrilha}>
          <View style={styles.medidorBarra}>
            <View style={styles.medidorFaixaAbaixo} />
            <View style={styles.medidorFaixaSaudavel} />
            <View style={styles.medidorFaixaSobrepeso} />
          </View>

          {calculado && (
            <View style={[styles.medidorMarcador, { left: `${posicao}%` }]} />
          )}
        </View>

        <View style={styles.medidorEtiquetas}>
          <View style={styles.etiqueta}>
            <View
              style={[styles.etiquetaBolinha, styles.etiquetaBolinhaAbaixo]}
            />
            <Text
              style={[
                styles.etiquetaTexto,
                calculado && cores.etiquetaAtiva === 0 && cores.etiqueta,
              ]}
            >
              Abaixo{"\n"}do peso
            </Text>
          </View>

          <View style={styles.etiqueta}>
            <View
              style={[styles.etiquetaBolinha, styles.etiquetaBolinhaSaudavel]}
            />
            <Text
              style={[
                styles.etiquetaTexto,
                calculado && cores.etiquetaAtiva === 1 && cores.etiqueta,
              ]}
            >
              Saudável
            </Text>
          </View>

          <View style={styles.etiqueta}>
            <View
              style={[styles.etiquetaBolinha, styles.etiquetaBolinhaSobrepeso]}
            />
            <Text
              style={[
                styles.etiquetaTexto,
                calculado && cores.etiquetaAtiva === 2 && cores.etiqueta,
              ]}
            >
              Sobrepeso
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.resultadoValorArea}>
        <Text style={styles.resultadoValorLabel}>IMC</Text>
        <Text
          style={[
            styles.resultadoValor,
            calculado ? cores.valor : styles.valorSemCalculo,
          ]}
        >
          {calculado ? imc : "0"}
        </Text>

        <View
          style={[
            styles.resultadoSelo,
            calculado ? cores.selo : styles.seloSemCalculo,
          ]}
        >
          <Text
            style={[
              styles.resultadoSeloTexto,
              calculado ? cores.seloTexto : styles.seloTextoSemCalculo,
            ]}
          >
            {calculado ? rotulo : "Informe seus dados"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Resultado;
