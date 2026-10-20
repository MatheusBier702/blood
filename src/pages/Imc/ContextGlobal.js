import React from "react";

export const GlobalContext = React.createContext();

export const GlobalStorage = ({ children }) => {
  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [tipoSangue, setTipoSangue] = React.useState("");
  const [altura, setAltura] = React.useState("");
  const [peso, setPeso] = React.useState("");
  const [imc, setImc] = React.useState(0);
  const [contador, setContador] = React.useState(0);

  function handleClick() {
    if (peso && altura) {
      const alturaEmMetros = altura > 3 ? altura / 100 : Number(altura);
      const calculoImc = peso / (alturaEmMetros * alturaEmMetros);
      const arredondarImc = calculoImc.toFixed(2);

      setImc(arredondarImc);
    }
  }

  function handleContadorIdade(operacao) {
    if (operacao === "+") {
      setContador((idadeAtual) => Number(idadeAtual) + 1);
    }

    if (operacao === "-") {
      setContador((idadeAtual) => Number(idadeAtual) - 1);
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        email, setEmail,
        nome, setNome, tipoSangue, setTipoSangue, setContador,
        altura,
        setAltura,
        peso,
        setPeso,
        imc,
        setImc,
        handleClick,
        contador,
        handleContadorIdade,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
