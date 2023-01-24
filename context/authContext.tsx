import React, { useReducer, createContext, ReactNode, Provider } from "react";

import { decode } from "jsonwebtoken";

// interface User {
//   username: string;
//   email: string;
//   token: string;
// }


// interface AuthContextProps {
//  user: User | null,
//   login: (userData: User) => void
//   logOut: () => void


// }

const initialState = {
  user: null,
  
};

if (typeof window !== "undefined" && window.localStorage.getItem("token")) {
  const decodeToken = decode(window.localStorage.getItem("token"));

  if (decodeToken?.exp * 1000 < Date.now()) {
    window.localStorage.removeItem("token");
  } else {
    initialState.user = decodeToken;
  }
}

const authUserContext = createContext({
  user: null,
  login: (userData) => {},
  logOut: () => {}
})

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
}

function AuthUserProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  };

  function logOut() {
    localStorage.removeItem("token")
    dispatch({
      type: "LOGOUT",
    });
  }

  return (
  <authUserContext.Provider value={{ user: state.user, login, logOut }}>
  {props.children }
  </authUserContext.Provider>
  
  )
}

export { authUserContext, AuthUserProvider};
