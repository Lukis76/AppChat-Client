import { gql, useQuery } from "@apollo/client";
import { userStorage } from "@context/authContext";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
//////////////////////////////
const OPERATION_REFRESH = gql`
  query Refresh {
    refresh {
      timeOut
    }
  }
`;
///////////////////////////////////////////
export const Refresh = ({ children }) => {
  //--------------------------------------
  const router = useRouter();
  //--------------------------------------------
  const { data } = useQuery(OPERATION_REFRESH, {
    onCompleted: () => {
      if (userStorage() && data && !data?.refresh?.timeOut) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/login");
      }
    },
  });
  //-------------------------------------
  return <Fragment>{children}</Fragment>;
  //-------------------------------------
};
