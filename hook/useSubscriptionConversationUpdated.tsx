import { Session } from "next-auth";
import { useMutationAndOnViewConversation } from "hook";
import { ConversationData, ConversationUpdatedData, MsgsData } from "types";
import { useSubscription } from "@apollo/client";
import { operations } from "graphQL/operations";
import { useRouter } from "next/router";

export const useSubscriptionConversationUpdate = (session: Session) => {
  
};
