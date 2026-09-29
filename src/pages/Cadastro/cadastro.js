import React from "react";
import { Pressable, TextInput } from "react-native";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalContext } from "../../api/GlobalContext";
const cadastro = () => {
//   const [nomeUsuario, setNomeUsuario] = React.useState("");

  const navigation = useNavigation()

  const {nomeUsuario, setNomeUsuario} = React.useContext(GlobalContext)

//   console.log(data.teste)

  return (
    <View>
      <TextInput
        placeholder="Digite seu nome para continuarmos"
        keyboardType="text"
        value={nomeUsuario}
        onChangeText={setNomeUsuario}
      />

      <Text>Nome: {nomeUsuario}</Text>

      <Pressable onPress={() => navigation.navigate("cadastroPesoAltura")}>
        <Text>Proximo</Text>
      </Pressable>
    </View>
  );
};

export default cadastro;
