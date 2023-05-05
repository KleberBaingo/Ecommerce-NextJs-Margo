import { createContext } from "react";

export const ProductContext = createContext();

export const useProducts = () => {};
export const ProductContextProvider = ({ children }) => {
  return <ProductContext.Provider>{children}</ProductContext.Provider>;
};
