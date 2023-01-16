import type { Session } from "next-auth";
import { useRouter } from "next/router";
import type { FC } from "react";
import { Header } from "./msg/header";
import { Input } from "./msg/input";
import { Messages } from "./msg/messages";

interface FeedWrapperProps {
  session: Session;
}

export const FeedWrapper: FC<FeedWrapperProps> = ({ session }) => {
  const router = useRouter();
  const { conversationId } = router.query;

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full overscroll-none">
      {conversationId && typeof conversationId === "string" ? (
        <div className="flex flex-col justify-between items-center min-h-screen w-full relative">
          <Header session={session} />
          <Messages session={session} conversationId={conversationId as string} />
          <Input session={session} conversationId={conversationId} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen w-full">seleciona una conversacion</div>
      )}
    </div>
  );
};
