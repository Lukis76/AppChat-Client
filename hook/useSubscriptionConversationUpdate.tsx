import { Session } from 'next-auth'
import { useMutationAndOnViewConversation } from 'hook'
import { ConversationData, ConversationUpdatedData } from 'types'
import { useSubscription } from '@apollo/client'
import { operations } from 'graphQL/operations'

export const useSubscriptionConversationUpdate = (session: Session) => {
  const { onViewConversation } = useMutationAndOnViewConversation(session)


  useSubscription<ConversationUpdatedData, null>(
    //----------------------------------------------
    operations.conversation.Subscriptions.updated,
    //----------------------------------------------------
    {
      onSubscriptionData: ({ client, subscriptionData }) => {
        //----------------------------------------------------
        const { data } = subscriptionData
        //---------------------------------
        if (!data) return
        //-------------------------------------------------------------
        const {
          conversationUpdated: { id: updateConversationId, latestMsg },
        } = data
        //-------------------------------------------------------------
        const conversationData = client.readQuery<ConversationData>({
          query: operations.conversation.Queries.conversations,
        })
        //-------------------------------------------------------------
        const isBeingAdded = !conversationData?.conversations.find(
          (c) => c.id === updateConversationId
        )
        //-------------------------------------------------------------
        if (isBeingAdded) {
          client.writeQuery<ConversationData>({
            query: operations.conversation.Queries.conversations,
            data: {
              conversations: [],
            },
          })
        }
      },
      //=================================================================
    }
  )



  return true
}
