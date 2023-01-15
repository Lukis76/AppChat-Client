import type { Session } from 'next-auth'
import { FC, useState } from 'react'
import { ConversationModalProps } from './modal/conversationModal'
import { ConversationFE } from 'types'
import { ConversationItem } from './conversationItem'
import { signOut } from 'next-auth/react'
import { SkeletonConversationList } from '../skeleton'

interface ConversationListProps {
  session: Session
  conversations: Array<ConversationFE>
  conversationsLoading: boolean
  onViewConversation: (a: any, b: any) => void
}

export const ConversationList: FC<ConversationListProps> = ({
  session,
  conversations,
  conversationsLoading,
  onViewConversation
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
  )

  return (
    <section className='flex flex-col justify-between items-center h-screen w-full relative'>
      <div className='flex flex-col justify-center items-center w-full h-full '>
        <div className='flex py-3 px-2 w-full'>
          <button
            className='flex justify-center items-center w-full py-2 px-4 rounded-lg text-zinc-200 bg-zinc-900 cursor-pointer font-normal'
            onClick={() => setIsOpen((state) => !state)}
          >
            find or start conversation
          </button>
        </div>
        {isOpen && (
          <ConversationModalProps session={session} close={setIsOpen} />
        )}

        <div className='flex flex-col justify-start items-center w-full h-full gap-2  overflow-hidden ove'>
          {conversationsLoading ? (
            <SkeletonConversationList cont={14} />
          ) : (
            sortedConversations.map((c) => (
              <ConversationItem
                key={c.id}
                session={session}
                conversation={c}
                onViewConversation={onViewConversation}
              />
            ))
          )}
        </div>
      </div>
      <div className='absolute bottom-2 left-0 right-0 w-full px-2'>
        <button
          className='bg-zinc-700 text-zinc-400 hover:bg-zinc-900 w-full px-4 py-1  rounded-lg'
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </section>
  )
}
