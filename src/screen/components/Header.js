import React from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../css/HeaderStyles";


function Header({ titulo = "Tela Inicial", voltar = false }) {
  const navigation = useNavigation();

  function handleVoltar() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.barra}>
        {voltar ? (
         
          <Pressable
            style={({ pressed }) => [styles.botaoVoltar, pressed && styles.botaoPressionado]}
            onPress={handleVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={8}
          >
            <View style={styles.seta}>
              <View style={styles.setaLinha} />
              <View style={styles.setaPonta} />
            </View>
          </Pressable>
        ) : (
          /* menu */
          <View style={styles.botao}>
            <View style={styles.menu}>
              <View style={styles.menuBarra} />
              <View style={styles.menuBarra} />
              <View style={styles.menuBarra} />
            </View>
          </View>
        )}

        <View style={styles.tituloArea} pointerEvents="none">
          <Text style={styles.titulo} numberOfLines={1}>
            {titulo}
          </Text>
        </View>

  
      </View>

      <View style={styles.faixa} />
    </View>
  );
}

export default Header;
