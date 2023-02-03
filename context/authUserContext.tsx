import { AuthContextTypes } from "./types";
import { createContext } from "react";
/////////////////////////////////////////////////////////////////
export const authUserContext = createContext<AuthContextTypes>({
  user: null,
  login: () => {},
  logOut: () => {},
});
