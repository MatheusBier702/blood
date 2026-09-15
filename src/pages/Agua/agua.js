import React from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import Header from "../../screen/components/Header";
import { Consumo } from "./Consumo/consumo";
import { HistoricoCard } from "./HistoricoCard/HistoricoCard";
import { AddCopo } from "./AddCopo/AddCopo";
import { Onda } from "./Onda/Onda";
import { styles } from "../../screen/css/AguaStyle";

import {
  GlobalStorageAgua,
  GlobalContextAgua,
} from "./GlobalContextAgua";

const AguaContent = () => {
  const {
    objetivo,
    consumo,
    coposArray,
    porcentagem,
    atingiuObjetivo,
    peso, 
    setPeso
  } = React.useContext(GlobalContextAgua);


  const [formularioEnviado, setFormularioEnviado] = React.useState(false);

  const handleContinuar = () => {
    if (!peso) {
      return;
    }

    setFormularioEnviado(true);
  };

  // Formulário de peso
  if (!formularioEnviado) {
    return (
      <View style={styles.container}>
        <Header titulo="Água" voltar />

        <View style={styles.conteudo}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Qual é o seu peso?
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#666",
                marginBottom: 20,
              }}
            >
              Informe seu peso para podermos personalizar seu objetivo de
              consumo de água.
            </Text>

            <TextInput
              value={peso}
              onChangeText={setPeso}
              placeholder="Digite sua peso"
              keyboardType="numeric"
              maxLength={3}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 10,
                paddingHorizontal: 15,
                paddingVertical: 12,
                fontSize: 18,
                marginBottom: 15,
              }}
            />

            <TouchableOpacity
              onPress={handleContinuar}
              disabled={!peso}
              style={{
                backgroundColor: peso ? "#2196F3" : "#aaa",
                paddingVertical: 15,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                Continuar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Conteúdo normal da tela
  return (
    <View style={styles.container}>
      <Header titulo="Água" voltar />

      <View style={styles.conteudo}>
        <Onda porcentagem={porcentagem} />

        <Consumo
          consumido={consumo}
          objetivo={objetivo}
          lembrete="07:30 PM"
          falta="4 h 45 min"
          atingiuObjetivo={atingiuObjetivo}
        />

        <View style={styles.rodape}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listaCopos}
          >
            {coposArray.map((quantidade, index) => (
              <HistoricoCard
                key={`${quantidade}-${index}`}
                quantidade={quantidade}
              />
            ))}
          </ScrollView>

          <AddCopo />
        </View>
      </View>
    </View>
  );
};

export const Agua = () => {
  return (
    <GlobalStorageAgua>
      <AguaContent />
    </GlobalStorageAgua>
  );
};
