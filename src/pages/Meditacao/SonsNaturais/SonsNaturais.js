import React from "react";
import { Linking, Text, View } from "react-native";
import { styles } from "../../../screen/css/MeditacaoStyle";
import { Link } from "../../Alergias/Componentes/Componentes";
import { CardSom } from "../CardSom/CardSom";
import { SONS_NATURAIS } from "../dadosSons";
import { useSonsNaturais } from "../useSonsNaturais";

// Seção "Sons Naturais" da aba Meditação: cinco blocos independentes,
// um único som tocando por vez.
export const SonsNaturais = () => {
  const { alternar, parar, mudarVolume, estadoDe, somTocando } = useSonsNaturais();

  return (
    <View>
      <View style={styles.secaoLinha}>
        <Text style={styles.secao}>Sons Naturais</Text>
        {!!somTocando && <Link texto="Parar" onPress={parar} />}
      </View>
      <Text style={styles.legenda}>
        Escolha um ambiente para relaxar ou meditar. Os sons tocam em loop; ao escolher outro, o anterior para.
      </Text>

      <View style={styles.sons}>
        {SONS_NATURAIS.map((som) => (
          <CardSom key={som.id} som={som} estado={estadoDe(som)} onAlternar={alternar} onVolume={mudarVolume} />
        ))}
      </View>

      <Text style={[styles.legenda, { marginTop: 12 }]}>
        Gravações reais do{" "}
        <Text
          style={styles.link}
          accessibilityRole="link"
          onPress={() => Linking.openURL("https://commons.wikimedia.org").catch(() => {})}
        >
          Wikimedia Commons
        </Text>
        , usadas sob licenças livres (CC0, CC BY e CC BY-SA). Trechos editados para tocar em loop.
      </Text>
    </View>
  );
};
