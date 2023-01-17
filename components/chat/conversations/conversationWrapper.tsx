import { FC, useEffect } from "react";
import type { Session } from "next-auth";
import { ConversationList } from "./conversationList";
import { gql, useMutation, useQuery } from "@apollo/client";
import { operations } from "graphQL/operations";
import { ConversationCreatedSubscriptionData, ConversationData, ConversationUpdatedData, ConversationDeletedData, MsgsData } from "types";
import { useSubscriptionConversationDeleted } from "@hook/useSubscriptionConversationDeleted";
import { useSubscription } from "@apollo/client";
import { useRouter } from "next/router";
import { useViewConversation } from "@hook/useMutationAndOnViewConversation";

interface ConversationWrapperProps {
  session: Session;
}

export const ConversationWrapper: FC<ConversationWrapperProps> = ({ session }) => {
  //--------------------------------------------------------------------------------
  const router = useRouter();
  const conversationId = router?.query?.conversationId as string;
  ///////////////////////// Query ///////////////////////////////
  const {
    data: conversationsData,
    // error: conersationsErro,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationData, null>(operations.conversation.Queries.conversations);
  /////////////////////// Mutation and Subscription //////////////////////////////////

  ////// Subscription Updated Conversation ///////////
  const { onViewConversation } = useViewConversation();
  ///////////////////////////////////////////////////////
  useSubscription<ConversationUpdatedData, null>(
    //////////////////////////////////////////////
    operations.conversation.Subscriptions.updated,
    //////////////////////////////////////////////
    {
      onData: ({ client, data }) => {
        console.log("data : roket: =>>>>>", data.data);
        //=============================================
        if (!data.data) return;
        //===================================================================
        const { addUserIds, removeUserIds, conversationUpdated } = data.data;
        const { id: updateConversationId, latestMsg } = conversationUpdated.conversation;
        //===============================================================================
        // if (removeUserIds && removeUserIds.length) {
        //     //----------------------------------------------------------------
        // const isRemoved = removeUserIds.find((id) => id === session.user.id);
        //     //----------------------------------------------------------------
        // if (isRemoved) {
        //   const dataConversation = client.readQuery<ConversationData>({
        //     query: operations.conversation.Queries.conversations,
        //   });
        //       console.log(
        //         "🚀 ~ file: useSubscriptionConversationUpdated.tsx:35 ~ useSubscriptionConversationUpdate ~ dataConversation",
        //         dataConversation
        //       );
        //       //---------------------------
        // if (!dataConversation) return;
        //       //---------------------------
        // client.writeQuery<ConversationData>({
        //   query: operations.conversation.Queries.conversations,
        //   data: {
        //     conversations: dataConversation.conversations.filter((c) => c.id !== updateConversationId),
        //   },
        // });
        //       //------------------------------------------------------------
        if (conversationId === updateConversationId) {
          // router.replace(typeof "http://localhost:3000" === "string" ? "http://localhost:3000" : "");
          onViewConversation(conversationId, false, session);
        }
        //       //---------
        // return;
        //       //---------
        // }
        //     //=============
      },
      //   //============================================================
      //   if (addUserIds && addUserIds.length) {
      //     //------------------------------------------------------------
      //     const isAdd = addUserIds.find((id) => id === session.user.id);
      //     //------------------------------------------------------------
      //     if (isAdd) {
      //       const dataConversation = client.readQuery<ConversationData>({
      //         query: operations.conversation.Queries.conversations,
      //       });

      //       //---------------------------
      //       if (!dataConversation) return;
      //       //---------------------------
      //       client.writeQuery<ConversationData>({
      //         query: operations.conversation.Queries.conversations,
      //         data: {
      //           conversations: [...(dataConversation.conversations || []), conversationUpdated],
      //         },
      //       });
      //     }
      //     //=========================
      //   }
      //   //===================================================================
      //   if (updateConversationId === conversationId) {
      //     onViewConversation(conversationId, false, router, session);
      //     return;
      //   }
      //   //==================================================
      //   const exist = client.readQuery<MsgsData>({
      //     query: operations.message.Queries.msgs,
      //     variables: { conversationId: updateConversationId },
      //   });
      //   //===================================================
      //   if (!exist) return;
      //   //=============================================================
      //   const hasLastMsg = exist.msgs.find((m) => m.id === latestMsg.id);
      //   //=============================================================
      //   if (!hasLastMsg) {
      //     client.writeQuery<MsgsData>({
      //       query: operations.message.Queries.msgs,
      //       variables: {
      //         conversationId: updateConversationId,
      //       },
      //       data: {
      //         ...exist,
      //         msgs: [latestMsg, ...exist.msgs],
      //       },
      //     });
      //   }
      //   //==============================================
      // },
    }
  );
  // Subscription Deleted Conversation
  useSubscriptionConversationDeleted();
  ///////////////////////////////////////////////
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
