import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TIPOS_SANGUINEOS } from "../../Sangue/compatibilidade";
import { styles } from "../../../screen/css/LoginStyle";

export const TipoSanguineoLogin = ({ value, onChange }) => (
  <View style={styles.campo}>
    <Text style={styles.rotulo}>Tipo sanguíneo</Text>
    <View style={styles.seletor}>
      <Picker
        selectedValue={value}
        onValueChange={onChange}
        accessibilityLabel="Tipo sanguíneo"
        style={styles.picker}
      >
        <Picker.Item label="Selecione seu tipo" value="" />
        {TIPOS_SANGUINEOS.map((tipo) => (
          <Picker.Item key={tipo} label={tipo} value={tipo} />
        ))}
      </Picker>
    </View>
  </View>
);
