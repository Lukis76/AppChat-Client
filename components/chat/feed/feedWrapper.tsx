import { useQuery } from "@apollo/client";
import { operations } from "graphQL/operations";
import type { Session } from "next-auth";
import { useRouter } from "next/router"
import type { FC } from "react";
import { ConversationData } from "types";
import { Header } from "./msg/header";
import { Input } from "./msg/input";
import { Messages } from "./msg/messages";

interface FeedWrapperProps {
  session: Session;
}

export const FeedWrapper: FC<FeedWrapperProps> = ({ session }) => {
  const router = useRouter();
  const { conversationId } = router.query;

  const { data } = useQuery<ConversationData, null>(operations.conversation.Queries.conversations);

  const conversation = data?.conversations.find((conversation) => conversation.id === conversationId);

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full overscroll-none">
      {conversationId && typeof conversationId === "string" && conversation ? (
        <div className="flex flex-col justify-between items-center min-h-screen w-full relative">
          <Header session={session} conversation={conversation} />
          <Messages session={session} conversationId={conversationId as string} />
          <Input session={session} conversationId={conversationId} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen w-full">seleciona una conversacion</div>
      )}
    </div>
  );
};
