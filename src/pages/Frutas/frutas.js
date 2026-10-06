import React from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import axios from "axios";
import Header from "../../screen/components/Header";

export const Frutas = () => {
  const [fruta, setFruta] = React.useState("");

  const handleClick = async () => {
    if (!fruta.trim()) {
      console.log("Digite o nome de uma fruta.");
      return;
    }

    try {
      const response = await axios.get(
        `https://www.fruityvice.com/api/fruit/${fruta.trim()}`
      );

      console.log(response.data);
    } catch (error) {
      console.error("Erro ao buscar fruta:", error);
    }
  };

  return (
    <View>
      <Header titulo="Frutas" voltar />

      <TextInput
        placeholder="Digite sua fruta"
        value={fruta}
        onChangeText={setFruta}
      />

      <Pressable onPress={handleClick}>
        <Text>BUSCAR FRUTA</Text>
      </Pressable>
    </View>
  );
};