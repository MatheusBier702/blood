import React, { useContext } from "react";
import { Pressable, TextInput } from "react-native";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalContext } from "../../api/GlobalContext";

const cadastroPesoAltura = () => {
  const { nomeUsuario, valorPeso, setValorPeso, valorAltura, setValorAltura } =
    useContext(GlobalContext);

    const navigation = useNavigation()

  return (
    <View>
      <Text>Olá {nomeUsuario}</Text>
      <Text>Para continuar digite seu PESO e ALTURA</Text>

      {/* A ideia é que aqui seja o um select com todos os tipos de sangue possiveis */}
      <TextInput
        placeholder="Digite seu nome para continuarmos"
        keyboardType="text"
        value={valorPeso}
        onChangeText={setValorPeso}
      />
      <TextInput
        placeholder="Digite seu nome para continuarmos"
        keyboardType="text"
        value={valorAltura}
        onChangeText={setValorAltura}
      />

      <Pressable onPress={() => navigation.navigate("cadastroSangue")}>
        <Text>Proximo</Text>
      </Pressable>
    </View>
  );
};

export default cadastroPesoAltura;
