import { Dispatch, FC, SetStateAction } from "react";
import { SearchUser } from "types";
import { TypeState } from "./conversationModal";

type TypeParticipants = {
  state: TypeState;
  setState: Dispatch<SetStateAction<TypeState>>;
};

export const Participants: FC<TypeParticipants> = ({ state, setState }) => {

  const removeParticipant = (userId: string) => {
    setState((prev) => ({
      ...prev,
      participants: prev.participants.filter((u) => u.id !== userId),
    }));
  };

  return (
    <div className="flex flex-wrap flex-row w-full">
      {state.participants.map((user: SearchUser) => (
        <div
          key={user.id}
          className="flex flex-row items-center hover:bg-blue-700 rounded-lg pl-3 pr-1 gap-2 "
        >
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
