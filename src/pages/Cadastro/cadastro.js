import React from "react";
import { TextInput } from "react-native";
import { View, Text } from "react-native";
const cadastro = () => {

    const  [nomeUsuario, setNomeUsuario] = React.useState("");
    const  [emailUsuario, setEmailUsuario] = React.useState("");

  return (
    <View>
      {/* <TextInput
        style={styles.input}
        placeholder="Quantidade de água em ml"
        keyboardType="numeric"
        value={valorInput}
        onChangeText={setValorInput}
      /> */}


      <TextInput 
      placeholder="Nome"
      keyboardType="text"
      value={nomeUsuario}
      onChangeText={setNomeUsuario}
      />
      <TextInput 
      placeholder="Email"
      keyboardType="email"
      value={emailUsuario}
      onChangeText={setEmailUsuario}
      />


      <Text>Nome: {nomeUsuario}</Text>
      <Text>Email: {emailUsuario}</Text>
    </View>
  );
};

export default cadastro;
