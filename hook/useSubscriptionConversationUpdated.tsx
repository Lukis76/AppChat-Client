import { Session } from "next-auth";
import { useMutationAndOnViewConversation } from "hook";
import { ConversationData, ConversationUpdatedData, MsgsData } from "types";
import { useSubscription } from "@apollo/client";
import { operations } from "graphQL/operations";
import { useRouter } from "next/router";
import { useViewConversation } from "./useMutationAndOnViewConversation";

export const useSubscriptionConversationUpdate = (session: Session, conversationId: string) => {
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
        const isRemoved = data.data.removeUserIds.find((id) => id === session.user.id);
      }
      if (conversationId === data.data.conversationUpdated.conversation.id) {
        onViewConversation(conversationId, false, session);
      }
    },
  });
};
