import React from 'react';
import { View, Text, StyleSheet } from 'react';

export default function DadosPerfil() {
    
    return(
        <View style={styles.container}>
            <View style={styles.dado}>
                <Text style={styles.titulo}>IDADE</Text>
                <Text style={styles.valor}>17</Text>
            </View>

            <View style={styles.dado}>
                <Text style={styles.titulo}>TIPO SANGUÍNEO</Text>
                <Text style={styles.valor}>AB-</Text>
            </View>

            <View style={styles.dado}>
                <Text style={styles.titulo}>ALTURA</Text>
                <Text style={styles.valor}>1.70</Text>
            </View>

            <View style={styles.dado}>
                <Text style={styles.titulo}>PESO</Text>
                <Text style={styles.valor}>70 KG</Text>
            
            </View>

        </View>

    );
}

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 18,
    margin: 20,
    padding: 10,
  },

  dado: {
    width: '50%',
    padding: 15,
  },

  titulo: {
    fontSize: 11,
    color: '#667085',
    fontWeight: 'bold',
  },

  valor: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 5,
  },
});