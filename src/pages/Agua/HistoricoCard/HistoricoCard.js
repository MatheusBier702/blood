import React from "react";
import { Pressable, Text, View, Image } from "react-native";
import { styles } from "../../../screen/css/HistoricoCardStyle";
import {GlobalContextAgua} from '../GlobalContextAgua'
const copo = require("../../../screen/assets/copo.png");

export const HistoricoCard = ({ quantidade }) => {
  const { handleBeberAgua } = React.useContext(GlobalContextAgua)

  // function handleBeberAgua(quantidade) {
  //   console.log(quantidade)
  // }


  return (
    <Pressable style={styles.card} onPress={() => handleBeberAgua(quantidade)}>
      <View style={styles.selo}>
        <View style={styles.seloGota} />
      </View>

      <Image source={copo} style={styles.copoImagem} />

      <Text style={styles.quantidade}>+{quantidade} ml</Text>
    </Pressable>
  );
};
