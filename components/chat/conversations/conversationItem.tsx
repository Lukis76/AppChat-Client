import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import { ConversationFE, User } from "types";
import Image from "next/image";
import { formatUsersName } from "@utils/helpFunctions";
import ReactTimeAgo from "react-time-ago";
import { useRouter } from "next/router";
import { useViewConversation } from "@hook/useMutationAndOnViewConversation";
import { ContextMenu } from "@components/chat/conversations/modal/contextMenu";
import { authUserContext } from "@context/authUserContext";

interface ConversationItemProps {
  conversation: ConversationFE;
  setEditingConversation: Dispatch<SetStateAction<ConversationFE | null>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const ConversationItem: FC<ConversationItemProps> = ({ conversation, setEditingConversation, setIsOpen }) => {

  const user = useContext(authUserContext).user as User | null;
  const router = useRouter();
  const conversationId = router?.query?.conversationId as string;
  const [contextMenu, setContextMenu] = useState<boolean>(false);
  const customImg = "";
  const { onViewConversation } = useViewConversation();

  const getUserParticipant = (conversation: ConversationFE) => {
    return Boolean(conversation.participants.find((p) => p.user.id === user?.id)?.hasSeenLatestMsg);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.type === "click") {
      onViewConversation(conversation.id, getUserParticipant(conversation), user);
    } else if (e.type === "contextmenu") {
      e.preventDefault();
      setContextMenu(true);
    }
  };

  return (
    <div
      className={`relative flex flex-row justify-between items-center w-full pr-4 pl-2 py-2 bg-zinc-700 hover:bg-zinc-600  text-zinc-300 rounded-lg ease duration-75 cursor-pointer gap-4 ${conversation.id === conversationId && "bg-zinc-600"
        }`}
      onClick={(e) => {
        // router.push({ query: { conversationId: conversation.id } });
        handleClick(e);
      }}
      onContextMenu={handleClick}
    >
      {contextMenu && (
        <ContextMenu
          close={setContextMenu}
          conversationId={conversation.id}
          setEditingConversation={setEditingConversation}
          conversation={conversation}
          setIsOpen={setIsOpen}
        />
      )}
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
          <p className="text-sm truncate">{formatUsersName(conversation.participants, user?.id)}</p>
          <span className="text-xs">
            <ReactTimeAgo date={Number(new Date(conversation.updatedAt))} timeStyle={"twitter"} />
          </span>
        </div>
        <div className=" flex flex-row justify-between items-center w-full">
          <span className="truncate text-xs max-w-[12.5rem]">{conversation?.latestMsg?.body}</span>
          {getUserParticipant(conversation) === false && (
            <span className="flex self-end w-4 h-4 rounded-full animate-pulse opacity-0 bg-green-500" />
          )}
        </div>
      </div>
    </div>
  );
};
