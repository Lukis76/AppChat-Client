import type { ConversationParticipant } from "types";

export const formatUsersName = (participants: Array<ConversationParticipant>, myId?: string): string => {
  const usersName = participants
    // @ts-ignore
    .filter(({ user }) => user?.id != myId)
    // @ts-ignore
    .map(({ user }) => user?.username);

  console.log("partcipants |?|?|?|?|??|?|??|====>>>> ", usersName)

  return typeof usersName;
};
