import { useQuery } from "@apollo/client";
import { SkeletonMsgsList } from "@components/chat/skeleton";
import { authUserContext } from "@context/authContext";
import { operations } from "graphQL/operations";
import { FC, useContext, useEffect } from "react";
import { toast } from "react-hot-toast";
import { MsgsData, MsgsVar, MsgSubscriptionData, User } from "types";
import { MessageItem } from "./messageItem";


interface MessagesProps {
  conversationId: string;
}

export const Messages: FC<MessagesProps> = ({ conversationId }) => {


  const user = useContext(authUserContext).user as User | null;

  const { data, loading, error, subscribeToMore } = useQuery<MsgsData, MsgsVar>(
    operations.message.Queries.msgs,
    {
      variables: {
        conversationId,
      },
    }
  );

  useEffect(() => {
    subscribeToMore({
      document: operations.message.Subscriptions.msgSend,
      variables: {
        conversationId: conversationId,
      },
      updateQuery: (prev: any, { subscriptionData }: MsgSubscriptionData) => {
        if (!subscriptionData.data) return prev;

        const newMsg = subscriptionData.data.msgSend;

        return Object.assign({}, prev, {
          msgs: newMsg.sender.id === user?.id ? prev.msgs : [newMsg, ...prev.msgs],
        });
      },
    });
  }, [conversationId]);

  console.log("HERE SUBSCRIPTION DATA 🦓 💤 => ", data);

  if (error) {
    toast.error("Error fetching msg");
    return null;
  }

  return (
    <div className="flex flex-col justify-end  min-h-screen w-full pt-9 pb-12">
      {loading && <SkeletonMsgsList />}
      {data?.msgs && (
        <div className="flex flex-col-reverse justify-start w-full px-2 h-full  scrollbar-thin py-4 scrollbar-track-zinc-800 scrollbar-thumb-blue-500 scrollbar-thumb-rounded-full">
          {data.msgs.map((msg) => (
            <MessageItem key={msg.id} msg={msg} sendByMe={msg?.sender?.id === user?.id} />
          ))}
        </div>
      )}
    </div>
  );
};
