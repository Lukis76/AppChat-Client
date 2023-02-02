import { ConversationFE } from "types";

export const findExistConversation = (
  participantIds: Array<string>,
  id: string,
  conversations: Array<ConversationFE>
) => {
  let existConversation: ConversationFE | null = null;

  for (const conversation of conversations) {
    const addParticipants = conversation.participants.filter(
      (p) => p.user.id !== id
    );

    if (addParticipants.length !== participantIds.length) continue;

    let allMathchingParticipants: boolean = false;

    for (const participant of addParticipants) {
      const foundParticipant = participantIds.find(
        (p) => p === participant.user.id
      );

      if (!foundParticipant) {
        allMathchingParticipants = false;
        break;
      }

      allMathchingParticipants = true;
    }
    if (allMathchingParticipants) {
      existConversation = conversation;
    }
  }
  return existConversation;
};
