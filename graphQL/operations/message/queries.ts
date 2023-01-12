import { gql } from '@apollo/client'

export const Queries = {
  msgs: gql`
    query Msgs($conversationId: String) {
      msgs(conversationId: $conversationId) {
        createdAt
        id
        sender {
          id
          username
        }
        body
      }
    }
  `,
}
