import { FC, useEffect } from 'react'
import type { Session } from 'next-auth'
import { ConversationList } from './conversationList'
import { gql, useMutation, useQuery } from '@apollo/client'
import { operations } from 'graphQL/operations'
import {
  ConversationCreatedSubscriptionData,
  ConversationData,
  ConversationParticipant,
  ConversationUpdatedData,
  MsgsData,
} from 'types'
import { useSubscriptionConversationDeleted } from '@hook/useSubscriptionConversationDeleted'
import { useSubscription } from '@apollo/client'
import { useRouter } from 'next/router'

interface ConversationWrapperProps {
  session: Session
}

export const ConversationWrapper: FC<ConversationWrapperProps> = ({
  session,
}) => {
  /////////////////// Query //////////////////////
  const router = useRouter()
  const conversationId = router?.query?.conversationId as string

  const {
    data: conversationsData,
    error: conersationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationData, null>(
    operations.conversation.Queries.conversations
  )
  ///////////// Mutation and Subscription /////////////////////
  const [conversationRead] = useMutation<
    { conversationRead: boolean },
    { userId: string; conversationId: string }
  >(operations.conversation.Mutations.conversationRead)
  ///////////////////////////////////////////////////////////
  // Subscription Updated Conversation

  useSubscription<ConversationUpdatedData, null>(
    //----------------------------------------------
    operations.conversation.Subscriptions.updated,
    //----------------------------------------------------
    {
      onData: ({ client, data }) => {
        console.log('data : roket: =>>>>>', data)
        //----------------------------------------------------
        const { data: subscriptionData } = data
        //---------------------------------
        if (!subscriptionData) return
        //-----------------------------------------------------------------
        const { addUserIds, removeUserIds, conversationUpdated } =
          subscriptionData
        const { id: updateConversationId, latestMsg } = conversationUpdated
        //=================================================================
        if (removeUserIds && removeUserIds.length) {
          //----------------------------------------------------------------
          const isRemoved = removeUserIds.find((id) => id === session.user.id)
          //================================================================
          if (isRemoved) {
            const dataConversation = client.readQuery<ConversationData>({
              query: operations.conversation.Queries.conversations,
            })
            console.log(
              '🚀 ~ file: useSubscriptionConversationUpdated.tsx:35 ~ useSubscriptionConversationUpdate ~ dataConversation',
              dataConversation
            )

            //---------------------------
            if (!dataConversation) return
            //---------------------------
            client.writeQuery<ConversationData>({
              query: operations.conversation.Queries.conversations,
              data: {
                conversations: dataConversation.conversations.filter(
                  (c) => c.id !== updateConversationId
                ),
              },
            })
            //------------------------------------------------------------
            if (conversationId === updateConversationId) {
              router.replace(
                typeof 'http://localhost:3000' === 'string'
                  ? 'http://localhost:3000'
                  : ''
              )
            }
            //---------
            return
            //---------
          }
          //=============
        }
        //============================================================
        if (addUserIds && addUserIds.length) {
          //---------------------------------------------------------
          const isAdd = addUserIds.find((id) => id === session.user.id)
          //==============================================================
          if (isAdd) {
            const dataConversation = client.readQuery<ConversationData>({
              query: operations.conversation.Queries.conversations,
            })

            //---------------------------
            if (!dataConversation) return
            //---------------------------
            client.writeQuery<ConversationData>({
              query: operations.conversation.Queries.conversations,
              data: {
                conversations: [
                  ...(dataConversation.conversations || []),
                  conversationUpdated,
                ],
              },
            })
          }
          //=========================
        }
        //===================================================================
        if (updateConversationId === conversationId) {
          onViewConversation(conversationId, false)
          return
        }
        //==================================================
        const exist = client.readQuery<MsgsData>({
          query: operations.message.Queries.msgs,
          variables: { conversationId: updateConversationId },
        })
        //===================================================
        if (!exist) return
        //=============================================================
        const hasLastMsg = exist.msgs.find((m) => m.id === latestMsg.id)
        //=============================================================
        if (!hasLastMsg) {
          client.writeQuery<MsgsData>({
            query: operations.message.Queries.msgs,
            variables: {
              conversationId: updateConversationId,
            },
            data: {
              ...exist,
              msgs: [latestMsg, ...exist.msgs],
            },
          })
        }
        //==============================================
      },
    }
  )
  // Subscription Deleted Conversation
  useSubscriptionConversationDeleted()
  ////////////////////////////////////////////////
  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMsg: boolean
  ) => {
    //-------------------------------------------
    console.log('holis================>>>> 👍 👍 👍 👍 🧇')
    // const router = useRouter()
    router.push({ query: { conversationId } })
    //-------------------------------------------
    if (hasSeenLatestMsg) return
    //-------------------------------------------
    try {
      await conversationRead({
        //---------------------------
        variables: {
          userId: session.user.id,
          conversationId,
        },
        //---------------------------
        optimisticResponse: {
          conversationRead: true,
        },
        //---------------------------------------------------
        update: (cache) => {
          console.log("🚀 ~ file: 💯 conver444sationWrapper.tsx:181 ~ cache", cache)
          const participantsFragment = cache.readFragment<{
            participants: Array<ConversationParticipant>
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeentestMsg
                }
              }
            `,
          })
          //----------------------------------
          console.log(
            '🚀 ~ file: 👎 useMutationAndOnViewConversation.tsx:78 ~ onViewConversation: ~ participantsFragment',
            participantsFragment
          )
          if (!participantsFragment) return
          //----------------------------------------------------------
          const participants = [...participantsFragment.participants]
          const userParticipantIndex = participants.findIndex(
            (p) => p.user.id === session.user.id
          )
          console.log("🚀 ~ file: 👎 conversationWrapper.tsx:207 ~ userParticipantIndex", userParticipantIndex)
          //--------------------------------------
          if (userParticipantIndex === -1) return
          //--------------------------------------
          participants[userParticipantIndex] = {
            ...participants[userParticipantIndex],
            hasSeenLatestMsg: true,
          }
          /////////// Update Cache //////////////
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdateParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          })
        },
      })

    } catch (err) {
      console.log('on view conversation error', err)
    }
  }

  ///////////////////////////////////////////////
  useEffect(() => {
    subscribeToMore({
      document: operations.conversation.Subscriptions.created,
      updateQuery: (
        prev: any,
        { subscriptionData }: ConversationCreatedSubscriptionData
      ) => {
        if (!subscriptionData.data) return prev

        const newConversation = subscriptionData.data.conversationCreated

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        })
      },
    })
  }, [])
  //////////////////////////////////////////////////////////////////////////////
  return (
    <div className=' bg-zinc-800 w-full max-w-xs  min-w-[16rem]'>
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
        conversationsLoading={conversationsLoading}
        onViewConversation={onViewConversation}
      />
    </div>
  )
}
