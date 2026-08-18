import React from 'react';
import { Image, Text, View, Pressable } from 'react-native';
import { styles } from '../css/CardsStyles';

export const Cards = ({ nome, descricao, imagem, claro = false }) => {
  // descricao aceita string ou array de strings (uma linha por item)
  const linhas = Array.isArray(descricao) ? descricao : [descricao];

  function handleClick(nome) {
    console.log(nome)
  }

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => handleClick(nome)}>
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
        <Image source={imagem} style={styles.icone} resizeMode="contain" />
        </View>
      )}
      </Pressable>
    </View>
  );
};