import type { FC } from "react";
import { toast } from "react-hot-toast";
import { SearchUser } from "types";

interface ParticipantsProps {
  participants: Array<SearchUser>;
  removeParticipant: (userId: string) => void;
}

export const Participants: FC<ParticipantsProps> = ({ participants, removeParticipant }) => {
  console.log("here are participants 🤖 =>", participants);
  return (
    <div className="flex flex-wrap flex-row w-full">
      {participants.map((user: SearchUser) => (
        <div key={user.id} className="flex flex-row items-center hover:bg-blue-700 rounded-lg pl-3 pr-1 gap-2 ">
          <p className="text-center text-xs">{user.username}</p>
          <button
            className="text-center text-xs rounded-full p-1 hover:bg-red-500 my-1"
            onClick={() => {
              removeParticipant(user.id);
            }}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};
