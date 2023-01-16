import { useQuery } from "@apollo/client";
import SvgBack from "@assets/svg/svgBack";
import { useViewConversation } from "@hook/useMutationAndOnViewConversation";
import { formatUsersName } from "@utils/helpFunctions";
import { operations } from "graphQL/operations";
import type { Session } from "next-auth";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";
import { ConversationData, ConversationFE } from "types";

interface HeaderProps {
  session: Session;
}

export const Header: FC<HeaderProps> = ({ session }) => {
  const router = useRouter();
  const conversationId = router?.query?.conversationId as string;
  // const { onViewConversation } = useViewConversation();
  const { data } = useQuery<ConversationData, null>(operations.conversation.Queries.conversations);

  // const getUserParticipant = (conversation: ConversationFE) => {
  //   return Boolean(conversation.participants.find((p) => p.user.id === session.user.id)?.hasSeenLatestMsg);
  // };
  const conversation = data?.conversations.find((conversation) => conversation.id === conversationId);
  // useEffect(() => {
  //   console.log("dentro del use effect =>>>>>>> :))))");
  //   setTimeout(() => {
  //     if (conversationId && conversation) {
  //       onViewConversation(conversationId, getUserParticipant(conversation), router, session);
  //     }
  //   }, 1000);
  // }, [conversationId]);

  return (
    <div className="flex flex-row justify-start items-center truncate w-full py-1 px-2 bg-zinc-600 text-sm text-zinc-300 gap-2 absolute top-0">
      {conversation ? (
        <>
          <button
            className="fill-zinc-900 -ml-1"
            onClick={() => {
              router.push("/");
            }}
          >
            <SvgBack size={28} />
          </button>
          <p className="flex flex-row justify-start items-center gap-2">
            <span className="text-zinc-900 text-base font-semibold">Participants:{"  "}</span>
            <span>{formatUsersName(conversation?.participants, session?.user?.id)}</span>
          </p>
          <p></p>
        </>
      ) : (
        <span className="animate-pulse w-full h-6 my-1  rounded-lg bg-zinc-500 opacity-20" />
      )}
    </div>
  );
};
