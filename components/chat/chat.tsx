import { Profile } from "@components/perfil";
import type { Session } from "next-auth";
import type { FC } from "react";
import { ConversationWrapper } from "./conversations/conversationWrapper";
import { FeedWrapper } from "./feed/feedWrapper";
import { User } from 'types'
// import ModalProvider from "@context/ModalContext";

interface ChatProps {
  user: User;
}

export const Chat: FC<ChatProps> = () => {
  return (
    <div className="flex w-full h-screen  overflow-hidden">
      {/* <ModalProvider> */}
      <ConversationWrapper />

      <FeedWrapper/>
      <Profile />
      {/* </ModalProvider> */}
    </div>
  );
};
