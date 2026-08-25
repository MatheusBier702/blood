import { StyleSheet, Platform, StatusBar } from 'react-native';
import color from '../Colors/cor';

const ALTURA_STATUS = Platform.select({
  android: StatusBar.currentHeight || 24,
  ios: 44,
  default: 0,
});

export const styles = StyleSheet.create({
  container: {
    backgroundColor: color.colorModelFour,
    paddingTop: ALTURA_STATUS,
    boxShadow: '0px 2px 8px rgba(31, 61, 43, 0.25)',
  },

  barra: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  titulo: {
    color: color.branco,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 24,
    flex: 1,
  },

  acoes: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  botao: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Ícone de menu (três barras)
  menu: {
    width: 20,
    height: 14,
    justifyContent: 'space-between',
  },

  menuBarra: {
    height: 2,
    borderRadius: 2,
    backgroundColor: color.branco,
  },

  // Coração e demais glifos
  glifo: {
    color: color.branco,
    fontSize: 20,
    lineHeight: 22,
  },

  // Ícone de busca (círculo + cabo)
  lupa: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: color.branco,
  },

  lupaCabo: {
    position: 'absolute',
    width: 2,
    height: 7,
    right: 11,
    bottom: 9,
    borderRadius: 2,
    backgroundColor: color.branco,
    transform: [{ rotate: '-45deg' }],
  },

  // Menu de opções (três pontos)
  pontos: {
    height: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  ponto: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.branco,
  },

  // Faixa verde abaixo da barra, como no modelo
  faixa: {
    height: 18,
    backgroundColor: color.colorModelFour,
  },
});
