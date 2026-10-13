import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "../../../screen/css/FrutasStyle";

export const ResultadoFruta = ({ resultado, selecionada }) => {
  if (!resultado) return null;
  return (
    <View style={styles.resultado} accessibilityLiveRegion="polite">
      <View style={styles.resultadoCabecalho}>
        <Image
          source={selecionada.imagem}
          style={styles.resultadoIcone}
          resizeMode="contain"
          accessibilityLabel={selecionada.nome}
        />
        <View style={styles.resultadoTexto}>
          <Text style={styles.secao}>{selecionada.nome}</Text>
          <Text style={styles.legenda}>Nutrition facts · per 100 g</Text>
        </View>
      </View>
      <View style={styles.nutrientes}>
        {[
          ["Energy", "calories", "kcal"],
          ["Carbohydrates", "carbohydrates", "g"],
          ["Protein", "protein", "g"],
          ["Fat", "fat", "g"],
          ["Sugars", "sugar", "g"],
        ].map(([label, chave, unidade]) => (
          <View key={chave} style={styles.nutriente}>
            <Text style={styles.legenda}>{label}</Text>
            <Text style={styles.valor}>
              {resultado.nutritions[chave] ?? "—"}{" "}
              <Text style={styles.unidade}>{unidade}</Text>
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.fonte}>Source: Fruityvice</Text>
    </View>
  );
};
