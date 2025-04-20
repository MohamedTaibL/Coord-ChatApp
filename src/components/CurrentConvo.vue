<template>
  <div class="current-convo">
    <ChatCard :chat="tempChat" :isGroup="false" :isCommunity="false"/>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps} from 'vue';
import { useRouter, useRoute } from 'vue-router'; // for route and navigation
import { db, auth } from '../Firebase/config'; // Import Firebase instances
import ChatCard from './ChatCard.vue'; // Import the ChatCard component

const router = useRouter();
const route = useRoute(); // Get route information (for route.params)
const props = defineProps(["filter"]);

const otherUserId = route.params.id;
const tempChat = ref({
  id : null,
  messages : [],
  participants : auth.currentUser.uid != otherUserId ? [auth.currentUser.uid, otherUserId] : [auth.currentUser.uid]
});

// Function to fetch existing chat data between the current user and the other user
const fetchChatData = async () => {
  try {
    // Query Firestore for chats where the current user is a participant
    const chatRef = db.collection('chats').where('participants', 'array-contains', auth.currentUser.uid);
    const querySnapshot = await chatRef.get(); // Fetch the documents

    let foundChat = null;
    let chatDocId = null;

    querySnapshot.forEach(doc => {
      const chat = doc.data();
      // Check if both users are participants and it's not a group chat
      if (
        chat.participants.includes(auth.currentUser.uid) &&
        chat.participants.includes(otherUserId) &&
        (chat.participants.length == 2 &&
        otherUserId !== auth.currentUser.uid)
        || (chat.participants.length == 1)
      ) {
        foundChat = chat; // If a matching chat is found, save the data
        chatDocId = doc.id; // Save the document ID for redirection
      }
    });

    if (foundChat) {
      // If chat is found, update tempChat with the data and redirect to /private/:chatId
      router.push(`/private/${chatDocId}`); // Redirect to the private chat using doc.id
    } else {
      // Handle case where no chat is found (optional: create a new chat, show error, etc.)
      console.log('Chat not found between users.');
    }
  } catch (error) {
    console.error('Error fetching chat data:', error); // Handle any errors during fetching
  }
};

// Fetch chat data when the component is mounted
onMounted(() => {
  fetchChatData(); // Fetch chat data when component is mounted
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