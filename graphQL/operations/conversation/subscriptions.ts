import { gql } from "@apollo/client";

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
  updated: gql`
    subscription ConversationUpdated {
      conversationUpdated {
        conversation {
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
        addUserIds
        removeUserIds
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
};
