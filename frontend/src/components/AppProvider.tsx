"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/lib/context/AuthContext";

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
