import {
  ActionTypes,
  AuthContextTypes,
  AuthUserProviderProps,
  InitialStateProps,
  UserDataTypes,
} from "./types";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import React, { FC, createContext, useEffect, useReducer } from "react";
//////////////////////////////////////////////////////////////////////////////
const userStorage = () => {
  const user = typeof window !== "undefined" && localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
//////////////////////////////////////////
const initialState: InitialStateProps = {
  user: userStorage(),
};
/////////////////////////////////////////////////////////////////
export const authUserContext = createContext<AuthContextTypes>({
  user: null,
  login: () => {},
  logOut: () => {},
});
/////////////////////////////////////////////////////////////////////////
const authReducer = (state=initialState, action: ActionTypes) => {
  switch (action.type) {
    //-------------------------
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    //-------------------------
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    //-------------
    default:
      return state;
    //-------------
  }
};
//////////////////////////////
const OPERATION_REFRESH = gql`
  query Refresh {
    refresh {
      timeOut
    }
  }
`;
///////////////////////////////////////////////////////////////////////////////
export const AuthUserProvider: FC<AuthUserProviderProps> = ({ children }) => {
  //--------------------------------------------------------------------------
  const router = useRouter();
  const [state, dispatch] = useReducer(authReducer, initialState);
  //--------------------------------------------------------------
  const login = (userData: UserDataTypes) => {
    localStorage.setItem("user", JSON.stringify(userData));
    return dispatch({
      type: "LOGIN",
      payload: userData,
    });
  };
  //---------------------------------
  const logOut = () => {
    localStorage.removeItem("user");
    return dispatch({
      type: "LOGOUT",
    });
  };
  //-------------------------------------------
  const { data } = useQuery(OPERATION_REFRESH);
  //--------------------------------------------------------
  useEffect(() => {
    if (userStorage() && data && !data?.refresh?.timeOut) {
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [data]);
  //-----------------------------------------------------------------------
  return (
    <authUserContext.Provider value={{ user: state.user, login, logOut }}>
      {children}
    </authUserContext.Provider>
  );
  //-----------------------------------------------------------------------
};
