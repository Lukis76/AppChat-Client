import { useLazyQuery, useMutation } from '@apollo/client'
import { operations } from 'graphQL/operations'
import { Dispatch, FC, FormEvent, SetStateAction, useState } from 'react'
import {
  CreateConversationData,
  CreateConversationInput,
  SearchUser,
  SearchUsersData,
  SearchUsersInput,
} from 'types'
import { UserSearchList } from './useSearchList'
import { Participants } from './participants'
import { toast } from 'react-hot-toast'
import { SvgLoading } from '@assets/svg'
import { Session } from 'next-auth'
import { user } from 'graphQL/operations/user'
import { NextRouter, useRouter } from 'next/router'

interface ConversationModalProps {
  close: Dispatch<SetStateAction<boolean>>
  session?: Session
}

export const ConversationModalProps: FC<ConversationModalProps> = ({
  close,
  session,
}) => {
  const router: NextRouter = useRouter()
  const userId = session?.user.id as string
  const [username, setUsername] = useState<string>('')
  const [participants, setParticipants] = useState<Array<SearchUser>>([])

  const [searchUsers, { data: dataSearch, loading: loadingSearch, error }] =
    useLazyQuery<SearchUsersData, SearchUsersInput>(
      operations.user.Queries.searchUsers
    )

  console.log('🚀 ~  file: conversationModal.tsx:17 ~ data', dataSearch)
  const [createConversation, { loading: loadingCreateConversation }] =
    useMutation<CreateConversationData, CreateConversationInput>(
      operations.conversation.Mutations.createConversation
    )

  const handleSubmitSearch = async (e: FormEvent) => {
    e.preventDefault()
    console.log('dentro 👍', username)
    searchUsers({ variables: { username } })
  }

  const createdRoomSession = async () => {
    const participantIds: Array<string> = [
      userId,
      ...participants.map((el) => el.id),
    ]
    console.log('🚀 ~ participantIds', participantIds)
    try {
      const { data: dataConversation } = await createConversation({
        variables: { participantIds },
      })

      if (!dataConversation?.createConversation) {
        throw new Error('Filed to create conversation')
      }

      const { conversationId } = dataConversation?.createConversation

      router.push({
        query: { conversationId },
      })

      setParticipants([])
      setUsername('')
      close((state) => !state)

      console.log('🚀 ~ data   ', dataConversation)
    } catch (err: any) {
      console.log('on created session room => ', err)
      toast.error(err?.message)
    }
  }

  const addParticipant = (user: SearchUser) => {
    setParticipants((state) => [...state, user])
    setUsername('')
  }

  const removeParticipant = (userId: string) => {
    setParticipants((state) => state.filter((el) => el.id !== userId))
  }

  return (
    <div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-[#00000088] ease duration-200 z-50'>
      <div
        className='fixed w-screen h-screen top-0 left-0'
        onClick={() => {
          setUsername('')
          close((state) => !state)
        }}
      />
      <section className='relative flex flex-col justify-start items-center bg-zinc-900 text-zinc-300 max-w-2xl px-4 py-6 rounded-lg gap-4 z-20'>
        <button
          className='bg-red-500 opacity-70 p-2 rounded-lg absolute top-2 right-2 hover:opacity-100 ease duration-75'
          onClick={() => {
            setUsername('')
            close((state) => !state)
          }}
        >
          X
        </button>
        <h2 className='text-center font-semibold text-3xl w-full'>
          holisdffjeiu
        </h2>
        <form
          onSubmit={handleSubmitSearch}
          className='flex flex-col justify-start items-center gap-2'
        >
          <input
            type='text'
            value={username}
            placeholder='insert'
            onChange={(e) => setUsername(e.target.value)}
            className='px-2 py-1 rounded-md focus:bg-zinc-800 bg-zinc-900 border-zinc-700 border-2 text-lg w-full'
          />
          <button
            type='submit'
            disabled={!username}
            className='flex justify-center items-center bg-zinc-800 w-full py-1 px-4 text-lg rounded-md disabled:opacity-30 hover:bg-zinc-700 ease duration-100'
          >
            {loadingSearch ? <SvgLoading size={24} /> : 'search'}
          </button>
        </form>
        {dataSearch?.searchUsers && (
          <UserSearchList
            users={dataSearch?.searchUsers}
            addParticipant={addParticipant}
          />
        )}
        {participants.length !== 0 && (
          <>
            <Participants
              participants={participants}
              removeParticipant={removeParticipant}
            />
            <div className='flex justify-center items-center w-full'>
              <button
                className='flex justify-center items-center text-center text-lg font-medium rounded-lg px-4 py-1 bg-blue-400 w-full'
                onClick={createdRoomSession}
              >
                {loadingCreateConversation ? (
                  <SvgLoading size={24} />
                ) : (
                  'Create room'
                )}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
