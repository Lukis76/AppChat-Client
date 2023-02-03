import {
  ConversationFE,
  ConversationParticipant,
  SearchUser,
  SearchUsersData,
  SearchUsersInput,
} from "types";
import { Participants } from "./participants";
import { UserSearchList } from "./useSearchList";
import { useLazyQuery } from "@apollo/client";
import { SvgLoading } from "@assets/svg";
import { useRoom, useViewConversation } from "hook";
import { operations } from "graphQL/operations";
import { Dispatch, FC, FormEvent, SetStateAction, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { authUserContext } from "@context/authUserContext";

type TypeConversationModal = {
  close: Dispatch<SetStateAction<boolean>>;
  conversations: Array<ConversationFE>;
  editingConversation: ConversationFE | null;
};

export type TypeState = {
  username: string;
  participants: Array<SearchUser>;
  existConversation: ConversationFE | null;
};

export const ConversationModal: FC<TypeConversationModal> = ({
  close,
  conversations,
  editingConversation,
}) => {
  //-----------------------------------------------
  const [state, setState] = useState<TypeState>({
    username: "",
    participants: [],
    existConversation: null,
  });
  //-----------------------------------------------------
  const { user } = useContext(authUserContext);
  const { onViewConversation } = useViewConversation();
  //-----------------------------------------------------------------------------------------
  const [searchUsers, { data: dataSearch, loading: loadingSearch, error: searchUserError }] =
    useLazyQuery<SearchUsersData, SearchUsersInput>(operations.user.Queries.searchUsers);
  //-----------------------------------------------------------------------------------------
  const { onCreatedRoom, loadingCreateConversation } = useRoom(
    conversations,
    state,
    setState,
    close
  );
  //---------------------------------------------------
  const handleSubmitSearch = async (e: FormEvent) => {
    e.preventDefault();
    searchUsers({ variables: { username: state.username } });
  };
  //----------------------------------------------------------
  useEffect(() => {
    if (state.existConversation) {
      setState((prev) => ({
        ...prev,
        participants: prev.existConversation
          ? prev.existConversation.participants.map((p) => p.user)
          : [],
      }));
      return;
    }
  }, [editingConversation]);
  //---------------------------------------------------
  //---------------------------------------------------
  //------------------------------------------------------------
  //-----------------------------------------------

  const onConversationClick = () => {
    if (!state.existConversation) return;

    const { hasSeenLatestMsg } = state.existConversation.participants.find(
      (p) => p.user.id === user?.id
    ) as ConversationParticipant;

    onViewConversation(state.existConversation.id, hasSeenLatestMsg, user);
    close((state) => !state);
  };
  //-------------------------------------------------------------------
  //-------------------------------------------------------------------
  //-----------------------------------------------------------------------
  //-----------------------------------------------------------------------
  if (searchUserError) {
    toast.error(searchUserError.message.toString());
    return null;
  }
  //-----------------------------------------------------------------------
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-[#00000088] ease duration-200 z-50">
      <button
        className="fixed w-screen h-screen top-0 left-0"
        onClick={() => {
          setState((prev) => ({
            ...prev,
            username: "",
            participants: [],
          }));
          close((state) => !state);
        }}
      />
      <section className="relative flex flex-col justify-start items-center bg-zinc-900 text-zinc-300 max-w-2xl px-4 py-6 rounded-lg gap-4 z-20">
        <button
          className="bg-red-500 opacity-70 p-2 rounded-lg absolute top-2 right-2 hover:opacity-100 ease duration-75"
          onClick={() => {
            setState((prev) => ({
              ...prev,
              username: "",
              participants: [],
            }));
            close((state) => !state);
          }}
        >
          X
        </button>
        <h2 className="text-center font-semibold text-3xl w-full">holisdffjeiu</h2>
        <form
          onSubmit={handleSubmitSearch}
          className="flex flex-col justify-start items-center gap-2"
        >
          <input
            type="text"
            value={state.username}
            placeholder="insert"
            onChange={(e) => setState((prev) => ({ ...prev, username: e.target.value }))}
            className="px-2 py-1 rounded-md focus:bg-zinc-800 bg-zinc-900 border-zinc-700 border-2 text-lg w-full"
          />
          <button
            type="submit"
            disabled={!state.username}
            className="flex justify-center items-center bg-zinc-800 w-full py-1 px-4 text-lg rounded-md disabled:opacity-30 hover:bg-zinc-700 ease duration-100"
          >
            {loadingSearch ? <SvgLoading size={24} /> : "search"}
          </button>
        </form>
        {dataSearch?.searchUsers && (
          <UserSearchList users={dataSearch?.searchUsers} setState={setState} />
        )}
        {state.participants.length !== 0 && (
          <>
            {state.participants.length > 2 ? (
              <Participants state={state} setState={setState} />
            ) : (
              <p>the minimum number of participants is two </p>
            )}
            <div className="flex justify-center items-center w-full">
              <button
                className="flex justify-center items-center text-center text-lg font-medium rounded-lg px-4 py-1 bg-blue-400 w-full"
                onClick={() => onCreatedRoom(editingConversation)}
              >
                {loadingCreateConversation ? <SvgLoading size={24} /> : "Create room"}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};
