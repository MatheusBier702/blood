import { StyleSheet } from 'react-native';
import color from '../Colors/cor';

// Layout baseado no modelo de referência:
// cartão branco, cantos bem arredondados, sombra suave e
// ícone centralizado no topo, sobre fundo claro.
export const styles = StyleSheet.create({
  // O wrapper pinta o fundo da lista inteira e cria o respiro entre os cards.
  wrapper: {
    backgroundColor: color.fundo,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },

  card: {
    backgroundColor: color.branco,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: color.borda,
    paddingTop: 96, // espaço reservado para o ícone que fica centralizado no topo
    paddingBottom: 26,
    paddingHorizontal: 22,
    minHeight: 190,
    alignItems: 'center',
    justifyContent: 'flex-start',
    boxShadow: '0px 6px 16px rgba(31, 61, 43, 0.10)',
  },

  // Variação mais clara, caso queira alternar entre os cards
  cardClaro: {
    backgroundColor: color.colorModelFive,
    borderColor: color.colorModelFive,
  },

  titulo: {
    color: color.colorModelFour,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
    letterSpacing: -0.2,
    textAlign: 'center',
    marginBottom: 8,
  },

  descricao: {
    color: color.textoSuave,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
    textAlign: 'center',
  },

  // Centraliza o ícone no topo do cartão, como no modelo.
  iconeWrapper: {
    position: 'absolute',
    top: 26,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  icone: {
    width: 64,
    height: 64,
  },
});
