import { Profile } from "@components/perfil";
import type { Session } from "next-auth";
import type { FC } from "react";
import { ConversationWrapper } from "./conversations/conversationWrapper";
import { FeedWrapper } from "./feed/feedWrapper";
// import ModalProvider from "@context/ModalContext";

interface ChatProps {
  session: Session;
}

export const Chat: FC<ChatProps> = ({ session }) => {
  return (
    <div className="flex w-full h-screen  overflow-hidden">
      {/* <ModalProvider> */}
      <ConversationWrapper session={session} />

      <FeedWrapper session={session} />
      <Profile session={session} />
      {/* </ModalProvider> */}
    </div>
  );
};
