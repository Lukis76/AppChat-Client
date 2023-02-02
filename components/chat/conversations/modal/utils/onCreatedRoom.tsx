


export const useModal = () => {

  const onCreatedRoom = () => {
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
}





//=========================================
return {
  onCreatedRoom
}
//=========================================
}