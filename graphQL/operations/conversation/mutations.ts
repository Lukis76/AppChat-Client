import { gql } from "@apollo/client";
//
//
export const Mutations = {
  //-----------------------------------------------------------
  createConversation: gql`
    mutation CreateConversation($participantIds: [String]!) {
      createConversation(participantIds: $participantIds) {
        conversationId
      }
    }
  `,
  //------------------------------------------------------------------------
  conversationRead: gql`
    mutation ConversationRead($userId: String!, $conversationId: String!) {
      conversationRead(userId: $userId, conversationId: $conversationId)
    }
  `,
  //------------------------------------------------------------------------
  deleteConversation: gql`
    mutation DeleteConversation($conversationId: String!) {
      deleteConversation(conversationId: $conversationId)
    }
  `,
  //--------------------------------------------------------------------------------------
  updateParticipants: gql`
    mutation UpdateParticipants($conversationId: String!, $participantIds: [String]!) {
      updateParticipants(conversationId: $conversationId, participantIds: $participantIds)
    }
  `,
  //---------------------------------------------------------------------------------------
};
