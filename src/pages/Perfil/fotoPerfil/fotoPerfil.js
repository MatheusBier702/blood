import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react";
import * as ImagePicker from "expo-image-picker";

export default function FotoPerfil() {
  const [imagem, setImagem] = useState(null);

  const solicitarPermissoes = async () => {
    const camera = await ImagePicker.requestCameraPermissionsAsync();

    const galeria = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (camera.status !== "granted" || galeria.status !== "granted") {
      Alert.alert("permissao negada");

      return false;
    }
    return true;
  };

  const tirarFoto = async () => {
    const permissoes = await solicitarPermissoes();

    if (!permissoes) return;

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  const escolherDaGaleria = async () => {
    const permissoes = await solicitarPermissoes();

    if (!permissoes) return;

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={
          imagem
            ? { uri: imagem }
            : require("../../../screen/assets/fotoPerfil.png")
        }
      />

      <Pressable title="Tirar Foto" onPress={tirarFoto} />

      <Pressable title="Escolher da galeria" onPress={escolherDaGaleria} />
    </View>
  );
}

export const styles = StyleSheet.create({
  
  container: {
    alignItems: 'center',
    padding: 20,
  },

  foto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
})

