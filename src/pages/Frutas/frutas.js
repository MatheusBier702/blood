import React from "react";
import { View, ScrollView } from "react-native";
import Header from "../../screen/components/Header";
import { styles } from "../../screen/css/FrutasStyle";
import { BuscaFruta } from "./BuscaFruta/BuscaFruta";
import { EstadoBusca } from "./EstadoBusca/EstadoBusca";
import { ResultadoFruta } from "./ResultadoFruta/ResultadoFruta";
import { useFrutas } from "./useFrutas";

export const Frutas = () => {
  const { fruta, setFruta, resultado, selecionada, carregando, erro, buscar } =
    useFrutas();

  return (
    <View style={styles.container}>
      <Header titulo="Frutas" voltar />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.conteudo}>
          <BuscaFruta fruta={fruta} setFruta={setFruta} buscar={buscar} />
          <EstadoBusca
            carregando={carregando}
            selecionada={selecionada}
            erro={erro}
          />
          <ResultadoFruta resultado={resultado} selecionada={selecionada} />
        </View>
      </ScrollView>
    </View>
  );
};
