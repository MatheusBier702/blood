import React from "react";

export const GlobalContext = React.createContext(); 

export const GlobalStorage = ({children}) => {
    const [nomeUsuario, setNomeUsuario] = React.useState("");
    const [valorPeso, setValorPeso] = React.useState("");
    const [valorAltura, setValorAltura] = React.useState("");
    const [valorSangue, setValorSangue] = React.useState("");

    const teste = "teste"

    return (
        <GlobalContext.Provider value={{
            // input do usuario
            nomeUsuario, 
            setNomeUsuario, 
            
             // input do peso e altura
            valorPeso, 
            setValorPeso, 
            valorAltura, 
            setValorAltura,

            // input do tipo de sangue
            valorSangue, 
            setValorSangue
        }}>{children}</GlobalContext.Provider>
    )
}