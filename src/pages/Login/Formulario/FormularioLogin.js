import React from "react";
import { View, Text, Pressable } from "react-native";
import { GlobalContext } from "../../IMC/ContextGlobal";
import { CampoLogin } from "../Campo/CampoLogin";
import { TipoSanguineoLogin } from "../TipoSanguineo/TipoSanguineoLogin";
import { styles } from "../../../screen/css/LoginStyle";

export const FormularioLogin = ({ onEntrar }) => {
  const {
    nome,
    setNome,
    tipoSangue,
    setTipoSangue,
    peso,
    setPeso,
    altura,
    setAltura,
    contador,
    setContador,
  } = React.useContext(GlobalContext);

  return (
    <View style={styles.formulario}>
      <CampoLogin
        titulo="Nome"
        placeholder="Seu nome"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
      />
      <CampoLogin
        titulo="Idade"
        placeholder="Sua idade"
        value={String(contador || "")}
        onChangeText={setContador}
        keyboardType="numeric"
      />
      <TipoSanguineoLogin value={tipoSangue} onChange={setTipoSangue} />
      <CampoLogin
        titulo="Peso (kg)"
        placeholder="Ex: 70"
        value={peso}
        onChangeText={setPeso}
        keyboardType="decimal-pad"
      />
      <CampoLogin
        titulo="Altura (cm)"
        placeholder="Ex: 1.70"
        value={altura}
        onChangeText={setAltura}
        keyboardType="decimal-pad"
      />
      <Pressable
        onPress={onEntrar}
        accessibilityRole="button"
        style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
      >
        <Text style={styles.botaoTexto}>Entrar</Text>
      </Pressable>
    </View>
  );
};
