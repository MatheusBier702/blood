import React from "react";
import { View, ScrollView } from "react-native";
import Header from "../../screen/components/Header";
import { Consumo } from "./Consumo/consumo";
import { HistoricoCard } from "./HistoricoCard/HistoricoCard";
import { AddCopo } from "./AddCopo/AddCopo";
import { Onda } from "./Onda/Onda";
import { styles } from "../../screen/css/AguaStyle";

// Quantidades dos cards de copo (por enquanto fixas)
const copos = [250, 300, 500];

export const Agua = () => {
  return (
    <View style={styles.container}>
      <Header titulo="Água" voltar />

      <View style={styles.conteudo}>
        {/* fica atrás de tudo; só o efeito visual por enquanto */}
        <Onda porcentagem={24} />

        <Consumo
          consumido={550}
          objetivo={2223}
          lembrete="07:30 PM"
          falta="4 h 45 min"
        />

        <View style={styles.rodape}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listaCopos}
          >
            {copos.map((quantidade) => (
              <HistoricoCard key={quantidade} quantidade={quantidade} />
            ))}
          </ScrollView>

          <AddCopo />
        </View>
      </View>
    </View>
  );
};
