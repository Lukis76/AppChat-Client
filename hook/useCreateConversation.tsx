import { useMutation } from "@apollo/client";
import { TypeState } from "@components/chat/conversations/modal/conversationModal";
import { authUserContext } from "@context/authUserContext";
import { operations } from "graphQL/operations";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useContext } from "react";
import { toast } from "react-hot-toast";
import { CreateConversationData, CreateConversationInput } from "types";

export const useCreateConversation = (
  state: TypeState,
  setState: Dispatch<SetStateAction<TypeState>>,
  close: Dispatch<SetStateAction<boolean>>
) => {
  const router = useRouter();

  const { user } = useContext(authUserContext);

  const [createConversation, { loading: loadingCreateConversation }] = useMutation<
    CreateConversationData,
    CreateConversationInput
  >(operations.conversation.Mutations.createConversation);

  const onCreateConversation = async () => {
    const participantIds = [
      user?.id,
      ...state.participants.map((p) => {
        return p.id;
      }),
    ] as Array<string>;

    try {
      const { data, errors } = await createConversation({
        variables: { participantIds },
      });

      if (!data?.createConversation || errors) {
        throw new Error("Filed to create conversation");
      }

      const { conversationId } = data?.createConversation;

      router.push({
        query: { conversationId },
      });

      setState((prev) => ({
        ...prev,
        participants: [],
        username: "",
      }));

      close((state) => !state);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return { onCreateConversation, loadingCreateConversation };
};
