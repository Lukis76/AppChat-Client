import type { FC } from "react";
import { ConversationFE } from "types";
import Image from "next/image";
import { formatUsersName } from "@utils/helpFunctions";
import ReactTimeAgo from "react-time-ago";
import { useRouter } from "next/router";
import { Session } from "next-auth";
import { useViewConversation } from "@hook/useMutationAndOnViewConversation";

interface ConversationItemProps {
  conversation: ConversationFE;
  session: Session;
}

export const ConversationItem: FC<ConversationItemProps> = ({ conversation, session }) => {
  const router = useRouter();
  const conversationId = router?.query?.conversationId as string;
  const customImg = "";
  const { onViewConversation } = useViewConversation();

  const getUserParticipant = (conversation: ConversationFE) => {
    return Boolean(conversation.participants.find((p) => p.user.id === session.user.id)?.hasSeenLatestMsg);
  };

  const handleClick = (event: React.MouseEvent) => {
    if (event.type === "click") {
      onViewConversation(conversation.id, getUserParticipant(conversation), router, session);
    } else if (event.type === "contextmenu") {
      event.preventDefault();
    }
  };

  return (
    <div
      className={`flex flex-row justify-between items-center w-full pr-4 pl-2 py-2 bg-zinc-700 hover:bg-zinc-600  text-zinc-300 rounded-lg ease duration-75 cursor-pointer gap-4 ${
        conversation.id === conversationId && "bg-zinc-600"
      }`}
      onClick={(e) => {
        router.push({ query: { conversationId: conversation.id } });
        handleClick(e);
      }}
    >
      <Image
        src={
          customImg ||
          "https://thumbs.dreamstime.com/b/conceptual-hand-writing-showing-breakout-session-business-photo-showcasing-workshop-discussion-presentation-specific-topic-125699196.jpg"
        }
        width={60}
        height={60}
        quality={20}
        alt={"imagen de la session"}
        className="rounded-full "
      />
      <div className="flex flex-col justify-center items-center w-full">
        <div className="flex flex-row justify-between items-center w-full">
          <p className="text-sm truncate">{formatUsersName(conversation.participants, session.user.id)}</p>
          <span className="text-xs">
            <ReactTimeAgo date={Number(new Date(conversation.updatedAt))} timeStyle={"twitter"} />
          </span>
        </div>
        <div className=" flex flex-row justify-between items-center w-full">
          <span className="truncate self-start max-w-[12.5rem]">{conversation?.latestMsg?.body}</span>
          {getUserParticipant(conversation) === false && (
            <span className="flex self-end w-4 h-4 rounded-full animate-pulse opacity-0 bg-green-500" />
          )}
        </div>
      </div>
    </div>
  );
};
