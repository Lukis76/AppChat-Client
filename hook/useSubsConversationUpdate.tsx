import { ConversationUpdatedData, User } from "types";
import { useSubscription } from "@apollo/client";
import { operations } from "graphQL/operations";
import { useViewConversation } from "./useViewConversation";

export const useSubsConversationUpdate = (user: User, conversationId: string) => {
  ///////////////////////////////////////////////////////////////////////////////////////////////
  const { onViewConversation } = useViewConversation();
  ////////////////////////////////////////////////////////////////////////////////////////////////
  useSubscription<ConversationUpdatedData, null>(operations.conversation.Subscriptions.updated, {
    //============================================================================================
    onData: ({ client, data }) => {
      //----------------------------
      if (!data.data) return;
      //----------------------------
      if (data.data.removeUserIds && data.data.removeUserIds.length) {
        const isRemoved = data.data.removeUserIds.find((id) => id === user.id);
      }
      if (conversationId === data.data.conversationUpdated.conversation.id) {
        onViewConversation(conversationId, false, user);
      }
    },
  });
};
