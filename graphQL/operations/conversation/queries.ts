import { gql } from '@apollo/client'
export const Queries = {
  conversations: gql`
    query Conversations {
      conversations {
        id
        participants {
          user {
            id
            username
          }
          hasSeenLatestMsg
        }
        latestMsg {
          id
          sender {
            id
            username
          }
          body
          createdAt
        }
        updatedAt
        createdAt
      }
    }
  `,
}
