import { authUserContext } from '@context/authContext';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { SearchUser } from 'types';


const useonCreateConversation = async (  ) => {
  const router = useRouter()
const [participants, setParticipants] = useState<Array<SearchUser>>([]);

  const { user } = useContext(authUserContext)
  const participantIds = [user?.id, ...participants.map((p) => p.id)] as [string];
  console.log("holis ======> :))))", participantIds);
  try {
    const { data, errors } = await createConversation({
      variables: { participantIds },
    });
    console.log('holis ======>>>> 🎱 despues del createConversation', data)

    if (!data?.createConversation || errors) {
      throw new Error("Filed to create conversation");
    }

    const { conversationId } = data?.createConversation;

    router.push({
      query: { conversationId },
    });

    setParticipants([]);
    setUsername("");
    close((state) => !state);
  } catch (err) {
    console.log("on created session room => ", err);
    if (err instanceof Error) {
      toast.error(err.message);
    }
  }
};