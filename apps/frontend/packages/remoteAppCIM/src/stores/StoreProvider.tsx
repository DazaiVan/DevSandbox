import React, { createContext, useContext } from "react";
import store, { Store } from "./Store";

const StoreContext = createContext<Store | null>(null);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    )
}

export const useStore = (): Store => {
    const context = useContext(StoreContext);
    if (!context) {
      throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
  };