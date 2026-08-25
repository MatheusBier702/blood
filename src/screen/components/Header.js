import React from "react";
import { View, Text } from "react-native";
import { styles } from "../css/HeaderStyles";

function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.barra}>
        {/* menu */}
        <View style={styles.botao}>
          <View style={styles.menu}>
            <View style={styles.menuBarra} />
            <View style={styles.menuBarra} />
            <View style={styles.menuBarra} />
          </View>
        </View>

        <Text style={styles.titulo}>Tela Inicial</Text>

        <View style={styles.acoes}>
          {/* favoritos */}
          <View style={styles.botao}>
            <Text style={styles.glifo}>♥</Text>
          </View>

          {/* busca */}
          <View style={styles.botao}>
            <View style={styles.lupa} />
            <View style={styles.lupaCabo} />
          </View>

          {/* opções */}
          <View style={styles.botao}>
            <View style={styles.pontos}>
              <View style={styles.ponto} />
              <View style={styles.ponto} />
              <View style={styles.ponto} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.faixa} />
    </View>
  );
}

export default Header;
