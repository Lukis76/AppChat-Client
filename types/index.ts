import { Session } from 'next-auth'

/**
 *  User
 */
//------------------------------------------
export interface AuthProps {
  data: Session | null
}
//------------------------------------------
export interface CreateUsernameData {
  createUsername: {
    success: boolean
    error: string
  }
}
//------------------------------------------
export interface CreateUsernameVariables {
  username: string
}
//-----------------------------------------
export interface SearchUsersInput {
  username: string
}
//-----------------------------------------
export interface SearchUsersData {
  searchUsers: Array<SearchUser>
}
//-----------------------------------------
export interface SearchUser {
  id: string
  username: string
}
//-----------------------------------------
/**
 *  Conversation
 */
//------------------------------------------
export interface ConversationData {
  conversations: Array<ConversationFE>
}
//------------------------------------------
export interface CreateConversationData {
  createConversation: {
    conversationId: string
  }
}
//------------------------------------------
export interface CreateConversationInput {
  participantIds: Array<string>
}
//------------------------------------------
/**
 * conversations
 */
//-----------------------------------------------------
interface Conversation {
  id: string
  latestMsgId: string
  createdAt: Date
  updatedAt: Date
}
//------------------------------------------------------
export interface ConversationFE extends Conversation {
  participants: Array<ConversationParticipant>
  latestMsg: MsgFE
}
//-----------------------------------------------------
export interface ConversationParticipant {
  user: {
    id: string
    username: string
  }
  hasSeenLatestMsg: boolean
}
//----------------------------------------------------
export interface ConversationCreatedSubscriptionData {
  subscriptionData: {
    data: {
      conversationCreated: ConversationFE
    }
  }
}
//----------------------------------------------------
export interface ConversationUpdatedData {
  conversationUpdated: Omit<ConversationFE, "latestMsg"> & { latestMsg: MsgFE };
}
//----------------------------------------------------

/**
 * messages
 */
//--------------------------------------
export interface Msg {
  id: string
  conversationId: string
  senderId: string
  body: string
  createdAt: Date
  updatedAt: Date
}
//--------------------------------------
export interface MsgFE {
  id: string
  body: string
  sender: {
    id: string
    username: string
  }
  createdAt: Date
  updatedAt: Date
}
//--------------------------------------
export interface MsgsData {
  msgs: Array<MsgFE>
}
//--------------------------------------
export interface MsgsVar {
  conversationId: string
}
//--------------------------------------
export interface SendMsgVar {
  id: string
  conversationId: string
  senderId: string
  body: string
}
//--------------------------------------
export interface MsgSubscriptionData {
  subscriptionData: {
    data: {
      msgSend: MsgFE
    }
  }
}
//--------------------------------------
