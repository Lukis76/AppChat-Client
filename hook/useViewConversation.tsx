import { gql, useMutation } from "@apollo/client";
import { operations } from "graphQL/operations";
import { useRouter } from "next/router";
import { ConversationParticipant, User } from "types";

export const useViewConversation = () => {
  const router = useRouter();
  /////////////////////////////////////////////////////////
  const [conversationRead] = useMutation<
    { conversationRead: boolean },
    { userId: string; conversationId: string }
  >(operations.conversation.Mutations.conversationRead);
  ///////////////////////////////////////////////////////////
  return {
    onViewConversation: async (
      conversationId: string,
      hasSeenLatestMsg: boolean,
      user: User | null
    ) => {
      //-------------------------------------------
      router.push({ query: { conversationId } });
      //-------------------------------------------
      if (hasSeenLatestMsg) return;
      //-------------------------------------------
      try {
        await conversationRead({
          //---------------------------
          variables: {
            userId: user?.id as string,
            conversationId,
          },
          //---------------------------
          optimisticResponse: {
            conversationRead: true,
          },
          //---------------------------------------------------
          update: (cache) => {
            const participantsFragment = cache.readFragment<{
              participants: Array<ConversationParticipant>;
            }>({
              id: `Conversation:${conversationId}`,
              fragment: gql`
                fragment Participants on Conversation {
                  participants {
                    user {
                      id
                      username
                    }
                    hasSeenLatestMsg
                  }
                }
              `,
            });
            //----------------------------------
            if (!participantsFragment) return;
            //----------------------------------------------------------
            const participants = [...participantsFragment.participants];
            const userParticipantIndex = participants.findIndex((p) => p.user.id === user?.id);
            //--------------------------------------
            if (userParticipantIndex === -1) return;
            //--------------------------------------
            participants[userParticipantIndex] = {
              ...participants[userParticipantIndex],
              hasSeenLatestMsg: true,
            };
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
            });
          },
        });
      } catch (err) {}
    },
  };
};
