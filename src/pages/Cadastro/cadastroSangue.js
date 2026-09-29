import React from "react";
import { Pressable, TextBase, TextInput } from "react-native";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GlobalContext } from "../../api/GlobalContext";

const cadastroSangue = () => {
  const { valorSangue, setValorSangue } = React.useContext(GlobalContext);

  const navigation = useNavigation()

  return (
    <View>
      <Text>Qual o tipo do seu sangue?</Text>

        {/* Aqui a ideia é fazer um select quetem todos os tipos possiveis de sangue */}
      <TextInput
        placeholder="Digite o tipo de sangue"
        keyboardType="text"
        value={valorSangue}
        onChangeText={setValorSangue}
      />

      <Pressable onPress={() => navigation.navigate("Home")}>
        <Text>Finalizar</Text>
      </Pressable>
    </View>
  );
};

export default cadastroSangue;
