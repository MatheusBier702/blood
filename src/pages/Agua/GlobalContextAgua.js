import React from "react";

export const GlobalContextAgua = React.createContext();

export const GlobalStorageAgua = ({ children }) => {
  const [coposArray, setCoposArray] = React.useState([]);

  const [consumo, setConsumo] = React.useState(0);
  const [peso, setPeso] = React.useState("");

  const [value, setValue] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);

  // Calcula o objetivo de água baseado no peso
  // Peso em kg × 0,35 = litros
  // Depois converte para ml
  const objetivo = peso
    ? Math.round(Number(peso) * 35 )
    : 3000;

  function addValue(value) {
    const numero = Number(value);

    setModalVisible(false);

    // Ignora valor vazio, texto inválido ou número <= 0, pra nunca
    // deixar o consumo virar NaN (o que travaria tudo pra sempre,
    // já que NaN + qualquer coisa continua sendo NaN).
    if (!Number.isFinite(numero) || numero <= 0) {
      return;
    }

    setValue(numero);
    setCoposArray((prev) => [...prev, numero]);
    setConsumo((prev) => prev + numero);
  }

  function handleBeberAgua(value) {
    const numero = Number(value);

    if (!Number.isFinite(numero) || numero <= 0) {
      return;
    }

    setConsumo((prev) => prev + numero);
  }

  // Porcentagem do objetivo atingido
  const porcentagem =
    objetivo > 0
      ? Math.round((consumo / objetivo) * 100)
      : 0;

  // Verifica se o consumo passou do objetivo
  const atingiuObjetivo = consumo > objetivo;

  if (atingiuObjetivo) {
    console.log("É maior");
  } else {
    console.log("É menor");
  }

  return (
    <GlobalContextAgua.Provider
      value={{
        consumo,
        objetivo,
        addValue,
        modalVisible,
        setModalVisible,
        coposArray,
        handleBeberAgua,
        porcentagem,
        atingiuObjetivo,
        peso,
        setPeso,
      }}
    >
      {children}
    </GlobalContextAgua.Provider>
  );
};
