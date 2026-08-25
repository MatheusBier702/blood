import { StyleSheet } from 'react-native';
import color from '../Colors/cor'

// Paleta baseada no modelo de referência
const AZUL_ESCURO = '#1A46C7';
const AZUL_CLARO = '#2F6BF0';

export const styles = StyleSheet.create({
  // O wrapper existe para "abrir espaço" pro ícone que estoura o card.
  // Sem isso, no Android a imagem seria cortada (overflow: visible não é confiável lá).
  wrapper: {
    paddingRight: 28,
    paddingLeft: 28,
    paddingBottom: 26,
    marginBottom: 18,
  },

  card: {
    backgroundColor: '#fff',
    border: `2px solid ${color.colorModelOne}`,
    borderRadius: 26,
    paddingVertical: 26,
    paddingLeft: 26,
    paddingRight: 110, // espaço interno reservado pro ícone não encostar no texto
    minHeight: 150,
    justifyContent: 'center',
    boxShadow: `2px 2px 10px #666`
  },

  // Variação mais clara, caso queira alternar entre os cards
  cardClaro: {
    backgroundColor: AZUL_CLARO,
  },

  titulo: {
    color: color.colorModelOne,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 10,
  },

  descricao: {
    color:  color.colorModelOne,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  },


  icone: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 90,
    height: 90,
    // border: '1px solid green',
    //   borderRadius: 26
  },

  iconeWrapper: {
    
  }
});