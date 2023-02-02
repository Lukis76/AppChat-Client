import { Profile } from "@components/perfil";
import type { FC } from "react";
import { ConversationWrapper } from "./conversations/conversationWrapper";
import { FeedWrapper } from "./feed/feedWrapper";
// import ModalProvider from "@context/ModalContext";



export const Chat: FC = () => {
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
