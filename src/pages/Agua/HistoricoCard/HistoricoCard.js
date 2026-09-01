import React from "react";
import { Pressable, Text, View, Image } from "react-native";
import { styles } from "../../../screen/css/HistoricoCardStyle";

const copo = require("../../../screen/assets/copo.png");

export const HistoricoCard = ({ quantidade }) => {
  return (
    <Pressable style={styles.card}>
      <View style={styles.selo}>
        <View style={styles.seloGota} />
      </View>

      <Image source={copo} style={styles.copoImagem} />

      <Text style={styles.quantidade}>+{quantidade} ml</Text>
    </Pressable>
  );
};
