import { FC, useEffect } from "react";
import { ConversationList } from "./conversationList";
import { useQuery } from "@apollo/client";
import { operations } from "graphQL/operations";
import { ConversationCreatedSubscriptionData, ConversationData } from "types";
import { useSubsConversationDelete, useAddAndRemoveUser } from "hook";

export const ConversationWrapper: FC = () => {
  ///////////////////////// Query ///////////////////////////////
  const {
    data: conversationsData,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationData, null>(operations.conversation.Queries.conversations);
  ////////////////////////////////////////////////////////////////////////////////////
  //subscription add user and remove user
  useAddAndRemoveUser();
  ///////////////////////////////////////////////////////
  // Subscription Deleted Conversation
  useSubsConversationDelete();
  ///////////////////////////////////////////////
  useEffect(() => {
    subscribeToMore({
      document: operations.conversation.Subscriptions.created,
      updateQuery: (prev, { subscriptionData }: ConversationCreatedSubscriptionData) => {
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
        conversations={conversationsData?.conversations || []}
        conversationsLoading={conversationsLoading}
      />
    </div>
  );
};
