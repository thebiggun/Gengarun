import { createContext, useState } from "react";

export const OutputContext = createContext();

export const OutputProvider = ({ children }) => {
    const [output, setOutput] = useState("");

    return (
        <OutputContext.Provider value={{ output, setOutput }}>
            {children}
        </OutputContext.Provider>
    );
};
