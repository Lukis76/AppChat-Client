import { ConversationData, ConversationDeletedData} from "types";
import { useSubscription } from "@apollo/client";
import { operations } from "graphQL/operations";

export const useSubscriptionConversationDeleted = () => {
  useSubscription<ConversationDeletedData, null>(
    //=============================================
    operations.conversation.Subscriptions.deleted,
    //=============================================
    {
      onSubscriptionData: ({ client, subscriptionData }) => {
        //--------------------------------------------------
        const { data } = subscriptionData;
        //-------------------------------
        if (!data) return;
        //-----------------------------------------------------
        const exist = client.readQuery<ConversationData>({
          query: operations.conversation.Queries.conversations,
        });
        //-----------------------------------------------------
        if (!exist) return;
        //----------------------------
        const { conversations } = exist;
        const { id: deletedConversationId } = data.conversationDeleted;
        //-----------------------------------------------------------
        client.writeQuery<ConversationData>({
          query: operations.conversation.Queries.conversations,
          data: {
            conversations: conversations.filter((c) => c.id !== deletedConversationId),
          },
        });
      },
    }
  );
};
