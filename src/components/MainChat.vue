<template>
  <div class="main-chat">
    <ChatBar :chat="chat" @search="Search" :isPermited="isPermited"/>
    <ChatLive :search="search" :chat="chat" :isInvite="isInvite" :isPermited="isPermited"/>
  </div>
</template>

<script setup>
import ChatBar from "./ChatBar.vue";
import ChatLive from "./ChatLive.vue";
import { ref, watch, onMounted } from "vue";
import { useRoute , useRouter } from "vue-router";
import { db, auth } from "@/Firebase/config";



const route = useRoute();
const router = useRouter()
const search = ref("");
const isInvite = ref(false);
const isPermited = ref(true);
const chat = ref({
  id : null,
  isGroup : false,
  isCommunity : false,
  participants : []
});

function Search(newVal) {
  search.value = newVal
}

async function fetchChat() {
  const chatid = route.params.id;
  let uid = route.params.id;
  let chatVal = {
    id: null,
    participants: [],
    isGroup: false,
    isCommunity: false,
    messages: [],
  };

  if (route.name !== "new") {
    try{
       const chatDoc = await db.collection("chats").doc(chatid).get();
        if (chatDoc.exists) {
        chatVal = { id : chatDoc.id, ...chatDoc.data()}; 
        }
    }
    catch(e){
      chatVal = {
      id: null,
      participants: [],
      isGroup: false,
      isCommunity: false,
      messages: [],
      };
      alert("error loading the chat")
      router.push("/private")
    }

    const userRef = db.collection("users").doc(auth.currentUser.uid);
    const userDoc = await userRef.get();

    if(userDoc.exists && userDoc.data().invitations.includes(chatid)) isInvite.value = true;
    else isInvite.value = false;

    // first check if the user is allowed in this route ?
    if(!chatVal.participants.includes(auth.currentUser.uid)){ 
      if(!isInvite.value){
        console.log("user allowed in this route to check only")
        if(chatVal.isCommunity){
          isPermited.value = false;
        }
        else
        {
          isPermited.value = true;
          console.log("user not allowed in this route")
          router.push("/private")
        }

      }
    }
    chat.value = chatVal;
  }

  else {
    chat.value = {
      id: null,
      participants:
        auth.currentUser.uid === uid
          ? [auth.currentUser.uid]
          : [auth.currentUser.uid, uid],
      isGroup: false,
      isCommunity: false,
      messages: [],
    };
  }

  if (!chat.value.messages){
        chat.value.messages = []
  }

  if (!chat.value.isGroup && !chat.value.isCommunity) {
    if (!chat.value.name || !chat.value.bio || !chat.value.picture) {
      if (chat.value.participants.length != 1) {
        uid = chat.value.participants.find(
          (uid) => uid !== auth.currentUser.uid
        );
      }
      else {
        uid = chat.value.participants[0];
      }
      try{
        const userDoc = await db.collection("users").doc(uid).get();
        if (!chat.value.name)
            chat.value.name = userDoc.exists ? userDoc.data().name : "user1";
        if (!chat.value.bio)
            chat.value.bio = userDoc.exists
            ? "@" + userDoc.data().username
            : "username";
        if (!chat.value.picture)
            chat.value.picture = userDoc.exists ? userDoc.data().imgURL : null;
        }
        catch(e){
            chat.value.name = "user1";
            chat.value.bio = "username";
            chat.value.picture = null;
        }
    }
  }
  else if (chat.value.isGroup) {
    if (!chat.value.name || !chat.value.bio || !chat.value.picture) {
      if (!chat.value.name)
        chat.value.name = "Unnamed Group";
      if (!chat.value.bio)
        chat.value.bio = "No Description";
      if (!chat.value.picture)
        chat.value.picture = "https://i.ibb.co/bM6nqzt7/huggingavatar.png";
    }  
  }
  else {
    if (!chat.value.name || !chat.value.bio || !chat.value.picture) {
        if (!chat.value.name)
            chat.value.name = "Unnamed Community";
        if (!chat.value.bio)
            chat.value.bio = "No Description";
        if (!chat.value.picture)
            chat.value.picture = "https://i.ibb.co/W4xnwhjx/communityavatar.png";
    }
  }
}

watch(
  () => route.params.id,
  async () => {
    await fetchChat();
  }
);

onMounted(async () => {
  await fetchChat();
});
</script>

<style scoped>
.main-chat {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow-y: auto; /* Allow scrolling in the y direction */
  background-color: #dcf0f9;
}
</style>
