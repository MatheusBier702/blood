import React from "react";
import { View, Text, Image } from "react-native";
import { styles, faixaCores } from "../../../screen/css/FormulaStyle";

const imcIcon = require("../../../screen/assets/imc.png");
const dicaIcon = require("../../../screen/assets/dica.png");

// Apenas o conteúdo da tabela: cada item traz a faixa, o nome e as cores.
const FAIXAS = [
  { valor: "Abaixo de 18,5", rotulo: "Abaixo do peso", cor: faixaCores.abaixo },
  { valor: "18,5 – 24,9", rotulo: "Peso adequado", cor: faixaCores.adequado },
  { valor: "25,0 – 29,9", rotulo: "Sobrepeso", cor: faixaCores.sobrepeso },
  {
    valor: "30,0 – 34,9",
    rotulo: "Obesidade grau I",
    cor: faixaCores.obesidadeUm,
  },
  {
    valor: "35,0 – 39,9",
    rotulo: "Obesidade grau II",
    cor: faixaCores.obesidadeDois,
  },
  {
    valor: "40,0 ou mais",
    rotulo: "Obesidade grau III",
    cor: faixaCores.obesidadeTres,
  },
];

const Formula = () => {
  return (
    <View>
      {/* Introdução */}
      <View style={styles.cabecalho}>
        <Image source={imcIcon} style={styles.cabecalhoIcone} />
        <Text style={styles.titulo}>O que é o IMC?</Text>
      </View>

      <Text style={styles.texto}>
        O <Text style={styles.textoDestaque}>Índice de Massa Corporal</Text>{" "}
        relaciona o seu peso com a sua altura e indica, de forma rápida, se o
        peso está dentro da faixa esperada para o seu corpo.
      </Text>

      {/* Fórmula em destaque */}
      <View style={styles.formulaCaixa}>
        <Text style={styles.formulaSigla}>IMC</Text>
        <Text style={styles.formulaIgual}>=</Text>

        <View style={styles.fracao}>
          <Text style={styles.fracaoTexto}>peso (kg)</Text>
          <View style={styles.fracaoLinha} />
          <Text style={styles.fracaoTexto}>altura × altura (m)</Text>
        </View>
      </View>

      <Text style={styles.exemplo}>
        Exemplo: 70 ÷ (1,75 × 1,75) ={" "}
        <Text style={styles.exemploValor}>22,86</Text>
      </Text>

      {/* Tabela de classificação */}
      <Text style={styles.tabelaTitulo}>Classificação</Text>

      {FAIXAS.map((faixa) => (
        <View key={faixa.rotulo} style={[styles.linha]}>
          <View
            style={[styles.linhaMarca, { backgroundColor: faixa.cor.forte }]}
          />

          <Text style={[styles.linhaValor, { color: faixa.cor.forte }]}>
            {faixa.valor}
          </Text>

          <View style={styles.linhaSelo}>
            <Text style={[styles.linhaSeloTexto, { color: faixa.cor.forte }]}>
              {faixa.rotulo}
            </Text>
          </View>
        </View>
      ))}

      {/* Observação */}
      <View style={styles.nota}>
        <Image source={dicaIcon} style={styles.notaIcone} />
        <Text style={styles.notaTexto}>
          O IMC é uma referência geral e não considera massa muscular, idade ou
          composição corporal. Use como ponto de partida e converse com um
          profissional de saúde.
        </Text>
      </View>
    </View>
  );
};

export default Formula;
