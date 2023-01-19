import { useMutation } from "@apollo/client";
import { operations } from "graphQL/operations";
import { Session } from "next-auth";
import { FC, FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import ObjectID from "bson-objectid";
import { SendMsgVar, MsgsData, MsgsVar } from "types";

interface InputProps {
  session: Session;
  conversationId: string;
}

export const Input: FC<InputProps> = ({ session, conversationId }) => {
  const [msg, setMsg] = useState<string>("");

  const [sendMsg] = useMutation<{ sendMsg: boolean }, SendMsgVar>(
    operations.message.Mutations.sendMsg
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!msg) return;

    setMsg("");
    try {
      // send Msg Mutation
      const senderId = session?.user?.id as string;
      const newMsgId = ObjectID().toHexString();
      const newMsg: SendMsgVar = {
        id: newMsgId,
        body: msg,
        senderId,
        conversationId,
      };

      const { data, errors } = await sendMsg({
        variables: {
          ...newMsg,
        },
        optimisticResponse: {
          sendMsg: true,
        },
        update: (cache) => {
          const exist = cache.readQuery<MsgsData, MsgsVar>({
            query: operations.message.Queries.msgs,
            variables: { conversationId },
          }) as MsgsData;

          cache.writeQuery<MsgsData, MsgsVar>({
            query: operations.message.Queries.msgs,
            variables: { conversationId },
            data: {
              ...exist,
              msgs: [
                {
                  ...newMsg,
                  sender: {
                    id: session?.user?.id as string,
                    username: session.user.username,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...exist.msgs,
              ],
            },
          });
        },
      });

      if (!data?.sendMsg || errors) {
        throw new Error("failed to send Msg");
      }
    } catch (err: any) {
      console.log("handleSubmit > onSendMsg > Error 💣 💥 => ", err);
      toast.error(err?.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-row justify-start items-center w-full py-2 px-2 pt-3 gap-4 sticky bottom-0 bg-zinc-700"
    >
      <input
        placeholder="New message"
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        className="text-zinc-800 placeholder:text-zinc-700 px-3 py-0.5 rounded-xl w-full"
      />
      <button
        disabled={msg.length ? false : true}
        type="submit"
        className="bg-green-500 text-zinc-800 px-2 rounded-lg disabled:bg-red-300"
      >
        Send
      </button>
    </form>
  );
};
