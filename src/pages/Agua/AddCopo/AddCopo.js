import React from "react";
import {
  Text,
  Pressable,
  Modal,
  View,
  TextInput,
} from "react-native";
import { styles } from "../../../screen/css/AddCopoStyle";
import {HistoricoCard} from "../HistoricoCard/HistoricoCard"; 
import {GlobalContextAgua} from "../GlobalContextAgua"

export const AddCopo = () => {

  const {addValue, modalVisible, setModalVisible} = React.useContext(GlobalContextAgua)

  // const [modalVisible, setModalVisible] = React.useState(false);
  const [valorInput, setValorInput] = React.useState("");

  function handleAbrirModal() {
    setModalVisible(true);
  }

  function handleSelecionar(value) {
    console.log(value);
    setModalVisible(false);

    addValue(value)
  }



  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.botao,
          pressed && styles.botaoPressionado,
        ]}
        onPress={handleAbrirModal}
      >
        <Text style={styles.mais}>+</Text>
        <Text style={styles.texto}>BEBER</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>
              Beber
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Quantidade de água em ml"
              keyboardType="numeric"
              value={valorInput}
              onChangeText={setValorInput}
            />

            <Pressable
              style={styles.cancelar}
              onPress={() => handleSelecionar(valorInput)}
            >
              <Text style={styles.cancelarTexto}>
                Beber
              </Text>
            </Pressable>

            <Pressable
              style={styles.cancelar}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelarTexto}>
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};
