import React from "react";

export const GlobalContext = React.createContext();

export const GlobalStorage = ({ children }) => {
  const [altura, setAltura] = React.useState("");
  const [peso, setPeso] = React.useState("");
  const [imc, setImc] = React.useState(0);

  function handleClick() {
    const calculoImc = peso / (altura * altura);
    const arredondarImc = calculoImc.toFixed(2);

    setImc(arredondarImc);
  }

  return (
    <GlobalContext.Provider
      value={{
        altura,
        setAltura,
        peso,
        setPeso,
        imc,
        setImc,
        handleClick,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
