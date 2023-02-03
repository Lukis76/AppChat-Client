import type { Dispatch, FC, SetStateAction } from "react";
import { SearchUser } from "types";
import Image from "next/image";
import { TypeState } from "./conversationModal";

type TypeUseSearchList = {
  users: Array<SearchUser>;
  setState: Dispatch<SetStateAction<TypeState>>;
};

export const UserSearchList: FC<TypeUseSearchList> = ({ users, setState }) => {

  const addParticipant = (user: SearchUser) => {
    setState((prev) => ({
      ...prev,
      username: "",
      participants: [...prev.participants, user],
    }));
  };

  return (
    <div className="flex justify-center items-center w-full">
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="flex flex-col justify-start items-center w-full gap-1">
          {users.map((user: SearchUser) => (
            <div
              key={user.id}
              className="flex flex-row justify-between items-center pl-3 pr-1 py-1 rounded-lg hover:bg-zinc-800 w-full gap-4  max-w-md opacity-70 ease duration-75"
            >
              {/* <Image
                src={user.image}
                width={30}
                height={30}
                quality={30}
                alt={`iamgen avatar ${user.username}`}
                className='rounded-full'
              /> */}
              <p className="truncate">{user.username}</p>
              <button
                className="text-center hover:bg-zinc-900 text-zinc-300 rounded-lg p-2 bg-zinc-700 ease duration-75"
                onClick={() => addParticipant(user)}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
