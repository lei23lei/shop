"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";

export function StoreProvider({ children }: { children: JSX.Element }) {
  return <Provider store={store}>{children}</Provider>;
}
