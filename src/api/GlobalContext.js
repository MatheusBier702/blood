import React from "react";

export const GlobalContext = React.createContext(); 

export const GlobalStorage = ({children}) => {

    const teste = "teste"

    return (
        <GlobalContext.Provider value={{teste}}>{children}</GlobalContext.Provider>
    )
}