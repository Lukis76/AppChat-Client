import type { NextPage } from "next";
// import { getSession, signIn } from 'next-auth/react'
import { ChangeEvent, useContext, useState } from "react";
import SvgGoogle from "@assets/svg/svgGoogle";
import { useMutation } from "@apollo/client";
import { operations } from "graphQL/operations";
// import { AuthProps } from 'types'
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { SvgLoading } from "@assets/svg";
import { authUserContext } from "context/authContext";
import { useForm } from "hook/useHookAuth";
import { gql } from "graphql-tag";
import { GraphQLErrors } from "@apollo/client/errors";
//
//
//
const REGISTER_USER = gql`
  mutation Mutation($registerInput: RegisterInput) {
    registerUser(registerInput: $registerInput) {
      email
      username
      token
    }
  }
`;


const Auth: NextPage = (props) => {
  const context = useContext(authUserContext)
  const router = useRouter() 
  const [errors, setErrors] = useState<GraphQLErrors>([])

  function registerUserCallback() {
    console.log("callback hit ====<<<<<<")

    registerUser()


  }


  const { onChange, onSubmit, values} = useForm(registerUserCallback, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [registerUser, { loading, error }] = useMutation(REGISTER_USER, {
    update(proxy, {data: {registerUser: userData}}) {
      context.login(userData)
      router.push('/')

    },
    onError({ graphQLErrors }) {
      setErrors(graphQLErrors)
    },
    variables: { registerInput: values }
  });



  /////////////////////////////////////////////////////////////////////////////

  // const handleSave = async () => {
  //   // mutation
  //   if (username.length < 6) return;
  //   const data = await createUsername({ variables: { username } });
  //   //
  //   toast.success("Username successfully created! 🚀");
  //   router.push("/");
  // };

  // if (loading) {
  //   return (
  //     <div className="bg-zinc-800 flex flex-col justify-center items-center min-h-screen w-full">
  //       <SvgLoading size={28} className="text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" />
  //     </div>
  //   );
  // }

  return (
    <div className="bg-zinc-800 flex flex-col justify-center items-center min-h-screen w-full gap-4">

      <h3>Register</h3>
      <form className="flex flex-col gap-6 border-white border-2 p-8 rounded-2xl" onSubmit={onSubmit}>
        <input name="username" onChange={onChange} />
        <input name="email" onChange={onChange} />
        <input name="password" onChange={onChange} />
        <input name="confirmPassword" onChange={onChange} />
        <button type="submit" className="text-center py-1 px-6 rounded-lg bg-blue-500 hover:opacity-30">Registrarse</button>
        {
        errors.map((err,index) => {
          return <span key={index}>{err.message}</span>
        })
      }
      </form>


    </div>
  );
};
export default Auth;

