import { useMutation } from "@apollo/client";
import { operations } from "graphQL/operations";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export const useOnDeletedConversation = () => {
  //-------------------------------------------
  const router = useRouter();
  //------------------------------------------------------------------------------------------------
  const [deleteConversation] = useMutation<{ deleteConversation: boolean; conversationId: string }>(
    operations.conversation.Mutations.deleteConversation
  );
  //------------------------------------------------------------------------------------------------

  const onConversationDeleted = async (conversationId: string) => {
    try {
      toast.promise(
        deleteConversation({
          variables: { conversationId },
          update: () => {
            router.replace(
              typeof process.env.PUBLIC_URL === "string" ? process.env.PUBLIC_URL : ""
            );
          },
        }),
        {
          loading: "Deleted Conversation...",
          error: "Deleted Conversation failed!",
          success: "Delete Conversation Success!",
        }
      );
    } catch (err) {
      console.error("Deleted conversation Error", err);
    }
  };
  //-------------------------------
  return { onConversationDeleted };
};
