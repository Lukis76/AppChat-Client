import { gql } from '@apollo/client'

export const Subscriptions = {
  created: gql`
    subscription ConversationCreated {
      created {
        id
        participants {
          user {
            id
            username
          }
        }
        latestMsg {
          createdAt
          body
        }
        updatedAt
        createdAt
      }
    }
  `,
  updated: gql`
    subscription ConversationUpdated {
      conversationUpdated {
        id
        participants {
          user {
            id
            username
          }
        }
        latestMsg {
          createdAt
          body
        }
        updatedAt
        createdAt
      }
    }
  `,
  deleted: gql`
    subscription ConversationDeleted {
      conversationDeleted {
        id
      }
    }
  `,
}
