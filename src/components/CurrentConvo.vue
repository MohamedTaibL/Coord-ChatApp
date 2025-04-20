<template>
  <div class="current-convo">
    <ChatCard :chat="tempChat" :isGroup="false" :isCommunity="false"/>
  </div>
</template>
<script setup>
import { ref, onMounted, defineProps, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { db, auth } from '../Firebase/config';
import ChatCard from './ChatCard.vue';

const router = useRouter();
const route = useRoute();
const props = defineProps(["filter"]);

const otherUserId = route.params.id;
const tempChat = ref({
  id : null,
  messages : [],
  participants : auth.currentUser.uid != otherUserId ? [auth.currentUser.uid, otherUserId] : [auth.currentUser.uid],
  isGroup : false,
  isCommunity : false
});

let unsubscribe = null;

const listenForChat = () => {
  const chatRef = db.collection('chats').where('participants', 'array-contains', auth.currentUser.uid);

  unsubscribe = chatRef.onSnapshot(snapshot => {
    snapshot.forEach(doc => {
      const chat = doc.data();

      if (
        chat.participants.includes(auth.currentUser.uid) &&
        chat.participants.includes(otherUserId) &&
        (
          (chat.participants.length === 2 && otherUserId !== auth.currentUser.uid) ||
          (chat.participants.length === 1)
        ) &&
        !chat.isGroup && !chat.isCommunity
      ) {
        router.push(`/private/${doc.id}`);
      }
    });
  }, error => {
    console.error('Error with onSnapshot:', error);
  });
};

onMounted(() => {
  listenForChat();
});

onBeforeUnmount(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
  .current-convo {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
</style>