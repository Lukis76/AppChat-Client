import { useMutation } from "@apollo/client";
import { GraphQLErrors } from "@apollo/client/errors";
import { authUserContext } from "@context/authContext";
import { useForm } from "@hook/useHookAuth";
import gql from "graphql-tag";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";

const LOGIN_USER = gql`
  mutation login($loginInput: LoginInput) {
    loginUser(loginInput: $loginInput) {
      id
      username
      email
      token
    }
  }
`;

const Login: NextPage = () => {
  const router = useRouter();
  
  if(typeof window !== 'undefined') {
    if(localStorage.getItem('token')) {
      router.reload()
    }

  }

  const context = useContext(authUserContext);
  const [errors, setErrors] = useState<GraphQLErrors>([]);

  const loginUserCallback = () => {
    loginUser();
  };

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    email: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, { data: { loginUser: userData } }) {
      console.log("🚀 ~ file: login.tsx:36 ~ update ~ userData", userData);
      console.log("🚀 ~ file: login.tsx:36 ~ update ~ proxy", proxy);
      context.login(userData);
    },
    onCompleted() {
      router.replace('/login', '/');
    },
    onError({ graphQLErrors }) {
      setErrors(graphQLErrors);
    },
    variables: { loginInput: values },
  });

  return (
    <div className="bg-zinc-800 flex flex-col justify-center items-center min-h-screen w-full gap-4">
      <h3>Login</h3>
      <form
        className="flex flex-col gap-6 border-white border-2 p-8 rounded-2xl"
        onSubmit={onSubmit}
      >
        <input name="email" onChange={onChange} />
        <input name="password" onChange={onChange} />
        <button
          type="submit"
          className="text-center py-1 px-6 rounded-lg bg-blue-500 hover:opacity-30"
        >
          Login
        </button>
        {errors.map((err, index) => {
          return <span key={index + 1}>{err.message}</span>;
        })}
      </form>
    </div>
  );
};

export default Login;
