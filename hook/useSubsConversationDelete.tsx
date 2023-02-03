import { ConversationData, ConversationDeletedData } from "types";
import { useSubscription } from "@apollo/client";
import { operations } from "graphQL/operations";
import { useRouter } from "next/router";

export const useSubsConversationDelete = () => {
  ///////////////////////////////////////////////////////
  const router = useRouter();
  ///////////////////////////////////////////////
  useSubscription<ConversationDeletedData, null>(
    //=============================================
    operations.conversation.Subscriptions.deleted,
    //=============================================
    {
      onData: ({ client, data }) => {
        //--------------------------------------------------
        if (!data.data) return;
        //-----------------------------------------------------
        const read = client.readQuery<ConversationData>({
          query: operations.conversation.Queries.conversations,
        });
        //-----------------------------------------------------
        if (!read) return;
        //-----------------------------------------------------------
        client.writeQuery<ConversationData>({
          query: operations.conversation.Queries.conversations,
          data: {
            conversations: read.conversations.filter((c) => c.id !== data.data?.conversationDeleted.id),
          },
        });
        router.push("/");
      },
    }
  );
};
