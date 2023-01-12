import type { NextPage, NextPageContext } from 'next'
import { getSession, signIn, useSession } from 'next-auth/react'
import { ChangeEvent, useState } from 'react'
// import toast from "react-hot-toast";
// import UserOperations from "@graphql/operations/users";
// import { CreateUsernameData, CreateUsernameVariables } from "@util/types";
import Image from 'next/image'
import SvgGoogle from '@assets/svg/svgGoogle'
import { useMutation } from '@apollo/client'
import { operations } from 'graphQL/operations'
import { AuthProps, CreateUsernameData, CreateUsernameVariables } from 'types'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { SvgLoading } from '@assets/svg'

const Auth: NextPage<AuthProps> = ({ data }) => {
  console.log('🚀 ~ file: auth.tsx:15 ~ session', data)
  const router = useRouter()

  const [username, setUsername] = useState('')

  const [createUsername, { loading, error }] = useMutation(
    operations.user.Mutations.createUsername
  )

  const handleSave = async () => {
    // mutation
    if (username.length < 6) return
    //
    const data = await createUsername({ variables: { username } })
    //
    // valudar si es success o error lo que me llega en el data
    // para mostrar el toast de successs o error repectivos
    //
    console.log('🚀 ~ file: auth.tsx:34 ~ handleSave ~ data', data)
    toast.success('Username successfully created! 🚀')
    router.reload()
  }

  if (loading) {
    return (
      <div className='bg-zinc-800 flex flex-col justify-center items-center min-h-screen w-full'>
        <SvgLoading
          size={28}
          className='text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
        />
      </div>
    )
  }

  return (
    <div className='bg-zinc-800 flex flex-col justify-center items-center min-h-screen w-full'>
      <div className='flex flex-col justify-center items-center gap-4'>
        {data && !data?.user?.username && (
          <>
            <p className='text-2xl font-semibold text-slate-300'>
              Create a Username
            </p>
            <input
              placeholder='Enter a username'
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              className='px-2 py-1 rounded-md animate-pulse'
            />
            <button
              className={`flex flex-row justify-center items-center w-full px-4 py-2  rounded-xl font-semibold text-slate-900 gap-2  ${
                username.length < 6
                  ? 'bg-slate-700 cursor-default'
                  : 'bg-blue-500 hover:scale-105 ease duration-200'
              }`}
              onClick={handleSave}
            >
              Save
            </button>
          </>
        )}
        {!data && (
          <>
            {/* <Image
              height={100}
              width={100}
              src='/images/imessage-logo.png'
              alt='hola'
            /> */}
            <p className='text-3xl font-bold text-slate-300'>MessengerQL</p>
            <p className='max-w-sm text-center text-slate-400'>
              Sign in with Google to send unlimited free messages to your
              friends
            </p>
            <button
              onClick={() => signIn('google')}
              className='flex flex-row justify-center items-center px-4 py-2 bg-blue-500 rounded-xl font-semibold text-slate-900 gap-2 hover:scale-105 ease duration-200'
            >
              <SvgGoogle size={30} />
              Continue with Google
            </button>
          </>
        )}
      </div>
    </div>
  )
}
export default Auth

export async function getServerSideProps(context: NextPageContext) {
  const data = await getSession(context)
  console.log('🚀 ~ file: auth.tsx:90 ~ getServerSideProps ~ data', data)

  if (data && data?.user?.username?.length) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      data,
    },
  }
}
