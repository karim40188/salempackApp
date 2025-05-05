// ✅ src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const Context = createContext(null);

export function ContextProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("salemPack_token") || null);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [lastFiveOrders, setLastFiveOrders] = useState([])

  useEffect(() => {
    const storedToken = localStorage.getItem("salemPack_token");
    if (storedToken) setToken(storedToken);
  }, []);

  return (
    <Context.Provider value={{ token, setToken, baseUrl}}>
      {children}
    </Context.Provider>
  );
}
