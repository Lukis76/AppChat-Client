import SvgBack from "@assets/svg/svgBack";
import { authUserContext } from "@context/authContext";
import { useRouter } from "next/router";
import { FC, useContext } from "react";
import { ConversationFE, User } from "types";

interface HeaderProps {
  conversation: ConversationFE
}

export const Header: FC<HeaderProps> = ({ conversation }) => {
  const router = useRouter();

  const user = useContext(authUserContext).user as User | null;

  const usersparticipantsNames = conversation?.participants
    .filter((u) => u.user.id != user?.id)
    .map((u) => u.user.username)
    .join(", ");

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
          <p className="flex flex-row justify-start items-center gap-1">
            <span className="text-zinc-900 text-base font-semibold">Participants: {usersparticipantsNames}</span>
          </p>
          <p></p>
        </>
      ) : (
        <span className="animate-pulse w-full h-6 my-1  rounded-lg bg-zinc-500 opacity-20" />
      )}
    </div>
  );
};
