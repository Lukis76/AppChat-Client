import { useContext } from 'react'
import { useSubscription } from "@apollo/client";
import { authUserContext } from '@context/authUserContext';
import { operations } from 'graphQL/operations';
import { ConversationData, ConversationUpdatedData, MsgsData, User } from 'types';
import { useRouter } from 'next/router';
import { useViewConversation } from '.';

export const useAddAndRemoveUser = () => {
  const router = useRouter();
  const user = useContext(authUserContext).user as User | null;
  const conversationId = router?.query?.conversationId as string;
  const { onViewConversation } = useViewConversation();

  useSubscription<ConversationUpdatedData, null>(
    operations.conversation.Subscriptions.updated,
    {
      onData: ({ client, data }) => {
        //=============================================
        if (!data.data) return;
        const { addUserIds, removeUserIds, conversationUpdated } = data.data;
        const { id: updateConversationId, latestMsg } = conversationUpdated.conversation;
        //===============================================================================
        if (removeUserIds && removeUserIds.length) {
          //----------------------------------------------------------------
          const isRemoved = removeUserIds.find((id) => id === user?.id);
          //----------------------------------------------------------------
          if (isRemoved) {
            const dataConversation = client.readQuery<ConversationData>({
              query: operations.conversation.Queries.conversations,
            });
            //---------------------------
            if (!dataConversation) return;
            //---------------------------
            client.writeQuery<ConversationData>({
              query: operations.conversation.Queries.conversations,
              data: {
                conversations: dataConversation.conversations.filter((c) => c.id !== updateConversationId),
              },
            });
            //------------------------------------------------------------
            if (conversationId === updateConversationId) {
              router.replace(typeof "http://localhost:3000" === "string" ? "http://localhost:3000" : "");
              onViewConversation(conversationId, false, user);
            }
            //---------
            return;
            //---------
          }
        }
        /////////////// Add ///////////////////////////////////////////
        if (addUserIds && addUserIds.length) {
          //------------------------------------------------------------
          const isAdd = addUserIds.find((id) => id === user?.id);
          //------------------------------------------------------------
          if (isAdd) {
            const dataConversation = client.readQuery<ConversationData>({
              query: operations.conversation.Queries.conversations,
            });

            //---------------------------
            if (!dataConversation) return;

            //---------------------------
            client.writeQuery({
              query: operations.conversation.Queries.conversations,
              data: {
                conversations: [...(dataConversation.conversations || []), conversationUpdated],
              },
            });
          }
        }
        //===================================================================
        if (updateConversationId === conversationId) {
          onViewConversation(conversationId, false, user);
          return;
        }
        //==================================================
        const exist = client.readQuery<MsgsData>({
          query: operations.message.Queries.msgs,
          variables: { conversationId: updateConversationId },
        });
        //===================================================
        if (!exist) return;
        //=============================================================
        const hasLastMsg = exist.msgs.find((m) => m.id === latestMsg.id);
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
          });
        }
      },
    }
  );
}


