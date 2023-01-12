import { gql, useMutation } from "@apollo/client";
import { operations } from "graphQL/operations";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { ConversationParticipant } from "types";

export const useMutationAndOnViewConversation = (session: Session) => {
  /////////////////////////////////////////////////////////
  const [conversationRead] = useMutation<
    { conversationRead: boolean },
    { userId: string; conversationId: string }
  >(operations.conversation.Mutations.conversationRead);
  ///////////////////////////////////////////////////////////
  const onViewConversation = async (conversationId: string, hasSeenLatestMsg: string) => {
    //-------------------------------------------
    const router = useRouter();
    router.push({ query: { conversationId } });
    //-------------------------------------------
    if (hasSeenLatestMsg) return;
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
                  hasSeentestMsg
                }
              }
            `,
          });
          //----------------------------------
          if (!participantsFragment) return;
          //----------------------------------------------------------
          const participants = [...participantsFragment.participants];
          const userParticipantIndex = participants.findIndex((p) => p.user.id === session.user.id);
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
              fragment UpdateParticipants on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (err) {
      console.log("on view conversation error", err);
    }
  };
  /////////////////////////////////
  return { onViewConversation };
  ///////////////////////////////
};
