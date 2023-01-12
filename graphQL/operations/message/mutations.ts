import { gql } from '@apollo/client'

export const Mutations = {
  sendMsg: gql`
    mutation SendMsg(
      $id: String!
      $conversationId: String!
      $senderId: String!
      $body: String!
    ) {
      sendMsg(
        id: $id
        conversationId: $conversationId
        senderId: $senderId
        body: $body
      )
    }
  `,
}
