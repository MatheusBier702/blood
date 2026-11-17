import React from "react";
import { ScrollView, Text, View } from "react-native";
import Header from "../../../screen/components/Header";
import { styles } from "../../../screen/css/VacinasStyle";
import { GlobalContextVacinas } from "../GlobalContextVacinas";
import { CardVacina } from "../CardVacina/CardVacina";
import { Secao, Vazio } from "../../Alergias/Componentes/Componentes";

export const ProximasDoses = ({ navigation }) => {
  const { proximasDoses } = React.useContext(GlobalContextVacinas);
  const atrasadas = proximasDoses.filter((p) => p.calculo.proximaAtrasada);
  const proximas = proximasDoses.filter((p) => !p.calculo.proximaAtrasada);
  const abrir = (recomendacao) => navigation.navigate("DetalheVacina", { id: recomendacao.id });

  return (
    <View style={styles.container}>
      <Header titulo="Próximas doses" voltar />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>ACOMPANHAMENTO</Text>
          <Text style={styles.titulo}>Próximas doses</Text>
          <Text style={styles.subtitulo}>
            Doses em atraso e as previstas para os próximos 2 anos, de acordo com a idade e as doses registradas.
          </Text>

          <Secao titulo={`Em atraso (${atrasadas.length})`} />
          {atrasadas.length === 0 ? (
            <Vazio texto="Nenhuma dose em atraso." />
          ) : (
            atrasadas.map(({ recomendacao, calculo }) => (
              <CardVacina key={recomendacao.id} recomendacao={recomendacao} calculo={calculo} onPress={abrir} />
            ))
          )}

          <Secao titulo={`Próximas (${proximas.length})`} />
          {proximas.length === 0 ? (
            <Vazio texto="Nenhuma dose prevista para os próximos 2 anos." />
          ) : (
            proximas.map(({ recomendacao, calculo }) => (
              <CardVacina key={recomendacao.id} recomendacao={recomendacao} calculo={calculo} onPress={abrir} />
            ))
          )}

          <Text style={[styles.legenda, { marginTop: 16 }]}>
            Vacinas indicadas só para grupos específicos não aparecem aqui. Leve sempre a caderneta à unidade de saúde.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
