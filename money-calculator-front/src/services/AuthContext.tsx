import {createContext} from "react";
import {AuthContextType} from "@/models/AuthContext.ts";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);