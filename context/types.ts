import { ReactNode } from "react";
import { User } from "types";

///////////////////////////////////
export interface UserDataTypes {
  id: string
	username: string;
	email: string;
	token: string;
}

//---------------------------------------------
export type ActionTypes =
	| { type: "LOGOUT" }
	| { type: "LOGIN"; payload: UserDataTypes };

//-------------------------------------------
export interface AuthUserProviderProps {
	children: ReactNode;
}
//-----------------------------------------

export interface AuthContextTypes {
	user: User | null;
	login: (userData: UserDataTypes) => void;
	logOut: () => void;
}

//-----------------------------------
export interface InitialStateProps {
	user: UserDataTypes | null 
}
//-----------------------------------
