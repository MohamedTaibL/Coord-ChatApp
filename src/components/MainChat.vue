<template>
  <div class="main-chat">
    <ChatBar :chat="chat" :isOnline="isOnline" @search="search" />
    <ChatLive :search="search" :chat="chat" />
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
const chat = ref({
  id : null,
  isGroup : false,
  isCommunity : false,
  participants : []
});
const isOnline = ref(false);

async function listenToUserStatus() {
  const otherUserId = chat.value?.participants?.find(
    (uid) => uid !== auth.currentUser.uid
  );
  if (!otherUserId) return;
  try{
    const userRef = db.collection("users").doc(otherUserId);
    userRef.onSnapshot((doc) => {
      if (doc.exists) {
        console.log("here we are fetchi")
        isOnline.value = doc.data().state === "online";
      }
    });
  }catch(e){

  }
}

async function fetchChat() {
  const chatid = route.params.id;
  let uid = route.params.id;

  if (route.name !== "new") {
    
    const chatDoc = await db.collection("chats").doc(chatid).get();
    if (chatDoc.exists) {
      chat.value = { id : chatDoc.id, ...chatDoc.data()}; 
      console.log(chat.value)
    }
  } else {
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
      console.log(uid)
      const userDoc = await db.collection("users").doc(uid).get();
      if (!chat.value.name)
        chat.value.name = userDoc.exists ? userDoc.data().name : "user1";
      if (!chat.value.bio)
        chat.value.bio = userDoc.exists
          ? "@" + userDoc.data().username
          : "username";
      if (!chat.value.picture)
        chat.value.picture = userDoc.exists ? userDoc.data().imgURL : null;
      isOnline.value = userDoc.exists
        ? userDoc.data().state === "online"
        : false;
      
  
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
      isOnline.value = "offline";
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
        isOnline.value = "offline";
    }
  }
}

watch(
  () => route.params.id,
  async () => {
    await fetchChat();
    if (!chat.value?.isGroup && !chat.value?.isCommunity) {
      listenToUserStatus();
    }
  }
);

onMounted(async () => {
  try{
  await fetchChat();
  if (!chat.value?.isGroup && !chat.value?.isCommunity) {
    listenToUserStatus();
  }
  }
  catch(e){
    alert("Issue occured")
    router.push("/private")

  }
});
</script>

<style scoped>
.main-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #dcf0f9;
}
</style>
