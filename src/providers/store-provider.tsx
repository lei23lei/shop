"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";

interface StoreProviderProps {
  children: JSX.Element;
}

export function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
