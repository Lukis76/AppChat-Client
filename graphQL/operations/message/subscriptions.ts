import { gql } from '@apollo/client'

export const Subscriptions = {
  msgSend: gql`
    subscription ConversationCreated($conversationId: String) {
      msgSend(conversationId: $conversationId) {
        id
        sender {
          id
          username
        }
        body
        createdAt
      }
    }
  `,
}
