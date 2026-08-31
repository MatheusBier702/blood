import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../../screen/css/ImcStyle";
import { GlobalContext } from "../ContextGlobal";

const Resultado = () => {
  const { imc } = React.useContext(GlobalContext);

  return (
    <View style={styles.cartao}>
      <Text style={styles.resultadoTitulo}>Seu resultado</Text>

      <View style={styles.medidorArea}>
        <View style={{ width: "100%" }}>
          <View style={styles.medidorBarra}>
            <View style={styles.medidorFaixaAbaixo} />
            <View style={styles.medidorFaixaSaudavel} />
            <View style={styles.medidorFaixaSobrepeso} />
          </View>
          <View style={[styles.medidorMarcador, { left: "46%" }]} />
        </View>

        <View style={styles.medidorEtiquetas}>
          <View style={styles.etiqueta}>
            <View
              style={[styles.etiquetaBolinha, styles.etiquetaBolinhaAbaixo]}
            />
            <Text style={styles.etiquetaTexto}>Abaixo{"\n"}do peso</Text>
          </View>
          <View style={styles.etiqueta}>
            <View
              style={[styles.etiquetaBolinha, styles.etiquetaBolinhaSaudavel]}
            />
            <Text style={styles.etiquetaTexto}>Saudável</Text>
          </View>
          <View style={styles.etiqueta}>
            <View
              style={[styles.etiquetaBolinha, styles.etiquetaBolinhaSobrepeso]}
            />
            <Text style={styles.etiquetaTexto}>Sobrepeso</Text>
          </View>
        </View>
      </View>

      <View style={styles.resultadoValorArea}>
        <Text style={styles.resultadoValorLabel}>IMC</Text>
        <Text style={styles.resultadoValor}>{imc}</Text>

        <View style={styles.resultadoSelo}>
          <Text style={styles.resultadoSeloTexto}>Saudável</Text>
        </View>
      </View>
    </View>
  );
};

export default Resultado;
