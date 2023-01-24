import { Participants } from "./participants";
import { UserSearchList } from "./useSearchList";
import { useLazyQuery, useMutation } from "@apollo/client";
import { SvgLoading } from "@assets/svg";
import { useViewConversation } from "@hook/index";
import { operations } from "graphQL/operations";
import { ErrorMessage, Message } from "graphql-ws";
import { NextRouter, useRouter } from "next/router";
import {
	Dispatch,
	FC,
	FormEvent,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { toast } from "react-hot-toast";
import {
	ConversationFE,
	ConversationParticipant,
	CreateConversationData,
	CreateConversationInput,
	SearchUser,
	SearchUsersData,
	SearchUsersInput,
  User
} from "types";
import { authUserContext } from "@context/authContext";

interface ConversationModalProps {
	close: Dispatch<SetStateAction<boolean>>;
	conversations: Array<ConversationFE>;
	editingConversation: ConversationFE | null;
}

export const ConversationModal: FC<ConversationModalProps> = ({
	close,
	conversations,
	editingConversation,
}) => {
	//----------------------------------------------------------------------------------------

  const user = useContext(authUserContext).user as User | null;
	const router: NextRouter = useRouter();
	const userId = user?.id;
	const [username, setUsername] = useState<string>("");
	const [participants, setParticipants] = useState<Array<SearchUser>>([]);
	const [existConversation, setExistConversation] =
		useState<ConversationFE | null>(null);
	const { onViewConversation } = useViewConversation();
	//--------------------------------------------------------------------------------------------------------------------------
	const [
		searchUsers,
		{ data: dataSearch, loading: loadingSearch, error: searchUserError },
	] = useLazyQuery<SearchUsersData, SearchUsersInput>(
		operations.user.Queries.searchUsers,
	);
	//---------------------------------------------------------------------------------------------------------------------------------
	const [createConversation, { loading: loadingCreateConversation }] =
		useMutation<CreateConversationData, CreateConversationInput>(
			operations.conversation.Mutations.createConversation,
		);
	//----------------------------------------------------------------------------------------------------------------------------------------
	const [updateParticipants] = useMutation<
		{ updateParticipants: boolean },
		{ conversationId: string; participantIds: Array<string> }
	>(operations.conversation.Mutations.updateParticipants);
	const onSubmit = () => {
		console.log("dentro del on submit |??|?| => ", !participants.length);
		if (!participants.length) return;

		const participantIds = participants.map((p) => p.id);
		console.log("destro del onsubmit ==> ", participantIds);

		const exist = findExistConversation(participantIds);

		console.log("dentro del onsubmit =>", exist);

		if (exist) {
			toast("Conversation already exists");
			setExistConversation(exist);
			return;
		}
		console.log("dentro on Submit => fin ", editingConversation);

		editingConversation
			? onUpdateConversation(editingConversation)
			: onCreateConversation();
	};
	//-----------------------------------------------------------------------------
	const findExistConversation = (participantIds: Array<string>) => {
		let existConversation: ConversationFE | null = null;

		for (const conversation of conversations) {
			const addParticipants = conversation.participants.filter(
				(p) => p.user.id !== userId,
			);

			if (addParticipants.length !== participantIds.length) continue;

			let allMathchingParticipants: boolean = false;

			for (const participant of addParticipants) {
				const foundParticipant = participantIds.find(
					(p) => p === participant.user.id,
				);

				if (!foundParticipant) {
					allMathchingParticipants = false;
					break;
				}

				allMathchingParticipants = true;
			}
			if (allMathchingParticipants) {
				existConversation = conversation;
			}
		}
		return existConversation;
	};
	//---------------------------------------------------
	const handleSubmitSearch = async (e: FormEvent) => {
		e.preventDefault();
		searchUsers({ variables: { username } });
	};
	//---------------------------------------------------
	const onCreateConversation = async () => {
		const participantIds = [userId, ...participants.map((p) => p.id)] as [string];
		console.log("holis ======> :))))");
		try {
			const { data, errors } = await createConversation({
				variables: { participantIds },
			});

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
	//------------------------------------------------------------
	const onUpdateConversation = async (conversation: ConversationFE) => {
		const participantIds = participants.map((p) => p.id);
		try {
			const { data, errors } = await updateParticipants({
				variables: {
					conversationId: conversation.id,
					participantIds,
				},
			});

			if (!data?.updateParticipants || errors) {
				throw new Error("Failed updating participants");
			}

			setParticipants([]);
			setUsername("");
			close((state) => !state);
		} catch (err) {
			console.log("On Updated Conversation to participants Error", err);
			toast.error("Failed to updated Participants");
		}
	};
	//-----------------------------------------------

	const addParticipant = (user: SearchUser) => {
		setParticipants((state) => [...state, user]);
		setUsername("");
	};
	//-------------------------------------------------------------------

	const removeParticipant = (userId: string) => {
		setParticipants((state) => state.filter((u) => u.id !== userId));
	};
	//-------------------------------------------------------------------
	const onConversationClick = () => {
		if (!existConversation) return;

		const { hasSeenLatestMsg } = existConversation.participants.find(
			(p) => p.user.id === userId,
		) as ConversationParticipant;

		onViewConversation(existConversation.id, hasSeenLatestMsg, user);
		close((state) => !state);
	};
	//-----------------------------------------------------------------------
	useEffect(() => {
		if (editingConversation) {
			setParticipants(editingConversation.participants.map((p) => p.user));
			return;
		}
	}, [editingConversation]);
	//-----------------------------------------------------------------------
	if (searchUserError) {
		toast.error("Error searching for users");
		return null;
	}
	//-----------------------------------------------------------------------

	return (
		<div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-[#00000088] ease duration-200 z-50">
			<button
				className="fixed w-screen h-screen top-0 left-0"
				onClick={() => {
					setUsername("");
					setParticipants([]);
					close((state) => !state);
				}}
			/>
			<section className="relative flex flex-col justify-start items-center bg-zinc-900 text-zinc-300 max-w-2xl px-4 py-6 rounded-lg gap-4 z-20">
				<button
					className="bg-red-500 opacity-70 p-2 rounded-lg absolute top-2 right-2 hover:opacity-100 ease duration-75"
					onClick={() => {
						setUsername("");
						setParticipants([]);
						close((state) => !state);
					}}
				>
					X
				</button>
				<h2 className="text-center font-semibold text-3xl w-full">
					holisdffjeiu
				</h2>
				<form
					onSubmit={handleSubmitSearch}
					className="flex flex-col justify-start items-center gap-2"
				>
					<input
						type="text"
						value={username}
						placeholder="insert"
						onChange={(e) => setUsername(e.target.value)}
						className="px-2 py-1 rounded-md focus:bg-zinc-800 bg-zinc-900 border-zinc-700 border-2 text-lg w-full"
					/>
					<button
						type="submit"
						disabled={!username}
						className="flex justify-center items-center bg-zinc-800 w-full py-1 px-4 text-lg rounded-md disabled:opacity-30 hover:bg-zinc-700 ease duration-100"
					>
						{loadingSearch ? <SvgLoading size={24} /> : "search"}
					</button>
				</form>
				{dataSearch?.searchUsers && (
					<UserSearchList
						users={dataSearch?.searchUsers}
						addParticipant={addParticipant}
					/>
				)}
				{participants.length !== 0 && (
					<>
						{participants.length > 2 ? (
							<Participants
								participants={participants}
								removeParticipant={removeParticipant}
							/>
						) : (
							<p>the minimum number of participants is two </p>
						)}
						<div className="flex justify-center items-center w-full">
							<button
								className="flex justify-center items-center text-center text-lg font-medium rounded-lg px-4 py-1 bg-blue-400 w-full"
								onClick={onSubmit}
							>
								{loadingCreateConversation ? (
									<SvgLoading size={24} />
								) : (
									"Create room"
								)}
							</button>
						</div>
					</>
				)}
			</section>
		</div>
	);
};
