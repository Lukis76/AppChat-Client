import { FC, useEffect } from "react";
import type { Session } from "next-auth";
import { ConversationList } from "./conversationList";
import { useQuery } from "@apollo/client";
import { operations } from "graphQL/operations";
import { ConversationCreatedSubscriptionData, ConversationData } from "types";
import { useSubscriptionConversationUpdate } from "hook";

interface ConversationWrapperProps {
  session: Session;
}

export const ConversationWrapper: FC<ConversationWrapperProps> = ({ session }) => {
  /////////////////// Query //////////////////////
  const {
    data: conversationsData,
    error: conersationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationData, null>(operations.conversation.Queries.conversations);
  ///////////// Mutation and Subscription /////////////////////
  // Subscription Updated Conversation
  useSubscriptionConversationUpdate(session);
  // Subscription Deleted Conversation

  /////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    subscribeToMore({
      document: operations.conversation.Subscriptions.created,
      updateQuery: (prev: any, { subscriptionData }: ConversationCreatedSubscriptionData) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  }, []);
  //////////////////////////////////////////////////////////////////////////////
  return (
    <div className=" bg-zinc-800 w-full max-w-xs  min-w-[16rem]">
      <ConversationList
        session={session}
        conversations={conversationsData?.conversations || []}
        conversationsLoading={conversationsLoading}
      />
    </div>
  );
};
