import React from 'react';
import { Image, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../css/CardsStyles';

export const Cards = ({ nome, descricao, imagem, slug, claro = false }) => {
  const navigation = useNavigation();

  const linhas = Array.isArray(descricao) ? descricao : [descricao];

  function handleClick(slug) {
    navigation.navigate(slug);
    console.log(slug);
  }

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => handleClick(slug)}>
        <View style={[styles.card, claro && styles.cardClaro]}>
          <Text style={styles.titulo}>{nome}</Text>

          {linhas.map((linha, index) => (
            <Text key={index} style={styles.descricao}>
              {linha}
            </Text>
          ))}
        </View>

        {imagem && (
          <View style={styles.iconeWrapper}>
            <Image
              source={imagem}
              style={styles.icone}
              resizeMode="contain"
            />
          </View>
        )}
      </Pressable>
    </View>
  );
};