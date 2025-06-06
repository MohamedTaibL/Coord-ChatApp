<template>
  <div :class="['chat-card', { active: isActive || chat.id == null }, { invite: isInvite }]" ref="chatCard" @click="redirectToChat">
    <img :src="ChatPicture || 'https://www.gravatar.com/avatar/?d=mp'" class="avatar" />
    <div class="status-dot" :class="{ online: isOnline }" v-if="!isGroup && !isCommunity"></div>
    <div class="chat-details">
      <div>
        <strong>{{ ChatName }}</strong>
        <span v-if="hasUnread">
          <span v-if="mentionCount > 0" class="mention-badge">@{{ mentionCount }}</span>
          <span v-if="messageCount > 0" class="unread-dot"> {{ messageCount }}</span>
        </span>
      </div>
      <p>{{ LastMessage || 'checking...' }}</p>
    </div>
    <i 
      class="fa" 
      :class="{'fa-thumbtack active': isPinned, 'fa-palette': !isPinned}"
      @click.stop="togglePin"
      v-if="chat.id"
    ></i>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { defineProps } from 'vue';
import { auth, db, useUserPresence } from '@/Firebase/config';

const props = defineProps({
  chat: Object,
  isGroup: Boolean,
  isCommunity: Boolean,
  isInvite: Boolean,
});

const router = useRouter();
const ChatName = ref('');
const ChatPicture = ref(null);
const LastMessage = ref('');
const isActive = ref(false);
const chatCard = ref(null);
const isPinned = ref(false);
const hasUnread = ref(false); // Tracks if there are unread notifications
const messageCount = ref(0); // Tracks the total number of unread notifications
const mentionCount = ref(0); // Tracks the number of mentions
const otherUser = computed(() => {
  if (!props.isGroup && !props.isCommunity && Array.isArray(props.chat.participants)) {
    if (props.chat.participants.length !== 1) return props.chat.participants.find((uid) => uid !== auth.currentUser.uid);
    else return auth.currentUser.uid;
  }
  return null;
});
const isOnline = useUserPresence(otherUser.value);

let unsubscribeInbox = null; // To store the unsubscribe function for the snapshot listener

function checkActive() {
  const route = router.currentRoute.value;
  const matchPrivate = route.name === 'private' && !props.isCommunity;
  const matchCommunity = route.name === 'community' && (!props.isGroup && props.isCommunity);

  isActive.value = (matchPrivate || matchCommunity) && route.params.id === props.chat.id;
}

async function fetchInfo() {
  if (props.chat.picture) {
    ChatPicture.value = props.chat.picture;
  } else if (props.chat.participants) {
    if (props.chat.participants.length === 1 && !props.chat.isGroup && !props.chat.isCommunity) {
      const userDoc = await db.collection('users').doc(auth.currentUser.uid).get();
      ChatPicture.value = userDoc.exists ? userDoc.data().imgURL : null;
    } else if (!props.chat.isGroup && !props.chat.isCommunity) {
      const otherUser = props.chat.participants.find((uid) => uid !== auth.currentUser.uid);
      const userDoc = await db.collection('users').doc(otherUser).get();
      ChatPicture.value = userDoc.exists ? userDoc.data().imgURL : null;
    } else {
      if (props.chat.isGroup) {
        ChatPicture.value = 'https://i.ibb.co/bM6nqzt7/huggingavatar.png';
      } else if (props.chat.isCommunity) {
        ChatPicture.value = 'https://i.ibb.co/W4xnwhjx/communityavatar.png';
      }
    }
  }

  if (props.chat.name) {
    ChatName.value = props.chat.name;
  } else if (!props.isCommunity && !props.isGroup) {
    if (Array.isArray(props.chat.participants)) {
      if (props.chat.participants.length === 1 && !props.chat.isGroup && !props.chat.isCommunity) {
        const userDoc = await db.collection('users').doc(auth.currentUser.uid).get();
        ChatName.value = userDoc.exists ? userDoc.data().name : 'Unknown User';
      } else {
        const otherUser = props.chat.participants.find((uid) => uid !== auth.currentUser.uid);
        const userDoc = await db.collection('users').doc(otherUser).get();
        ChatName.value = userDoc.exists ? userDoc.data().name : 'Unknown User';
      }
    } else {
      ChatName.value = 'Unknown User';
    }
  } else {
    ChatName.value = props.isCommunity ? 'Unnamed Community' : 'Unnamed Group';
  }

  if (props.chat.messages && props.chat.messages.length > 0) {
    const messageSnapshot = await db
      .collection('messages')
      .where('chatId', '==', props.chat.id)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    if (!messageSnapshot.empty) {
      LastMessage.value = messageSnapshot.docs[0].data().content || 'No content';
    } else {
      LastMessage.value = 'No messages yet.';
    }
  } else {
    LastMessage.value = 'No messages yet.';
  }
}

function listenToNotifications() {
  const userRef = db.collection('users').doc(auth.currentUser.uid);

  unsubscribeInbox = userRef.onSnapshot((doc) => {
    if (!doc.exists) return;

    const inbox = doc.data().Inbox || [];
    const chatNotifications = inbox.filter((notif) => notif.chatId === props.chat.id);
    const numberOfMessages = chatNotifications.filter((notif) => notif.type === 'message').length;
    const numberOfMentions = chatNotifications.filter((notif) => notif.type === 'mention').length;
    
    hasUnread.value = chatNotifications.length > 0;
    messageCount.value = numberOfMessages; // Update the notification count
    mentionCount.value = numberOfMentions; // Update the mention count
  });
}

function redirectToChat() {
  if (props.chat.id === null) {
    return;
  }

  if (!props.isCommunity) {
    router.push({ name: 'private', params: { id: props.chat.id } });
  } else if (props.isCommunity) {
    router.push({ name: 'community', params: { id: props.chat.id } });
  }
}

async function checkIfPinned() {
  if (!props.chat.id) {
    return;
  }

  const userRef = db.collection('users').doc(auth.currentUser.uid);
  const favoritesRef = userRef.collection('favorites');
  const snapshot = await favoritesRef.doc(props.chat.id).get();

  if (snapshot.exists) {
    isPinned.value = true;
  } else {
    isPinned.value = false;
  }
}



async function togglePin() {
  if (!props.chat.id) return;

  const userRef = db.collection('users').doc(auth.currentUser.uid);
  const favoritesRef = userRef.collection('favorites');

  if (isPinned.value) {
    await favoritesRef.doc(props.chat.id).delete();
    isPinned.value = false;
  } else {
    await favoritesRef.doc(props.chat.id).set({ pinned: true });
    isPinned.value = true;
  }
}

onMounted(() => {
  checkActive();
  fetchInfo();
  listenToNotifications();
  checkIfPinned();
});

onUnmounted(() => {
  if (unsubscribeInbox) {
    unsubscribeInbox(); // Clean up the snapshot listener
  }
});

watch(() => router.currentRoute.value, () => {
  checkActive();
});
</script>

<style scoped>
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.chat-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.chat-details strong {
  font-size: 1rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chat-details p {
  margin: 0;
  font-size: 0.875rem;
  color: #cccccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-card {
  background-color: #0d1a33;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.25s ease, transform 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative; /* Add this to allow absolute positioning of the status dot */
}

.chat-card:hover {
  background-color: #1a2b47;
  transform: translateY(-1px);
}

.chat-card.active {
  background-color: #264d73;
  box-shadow: 0 0 0 2px #4d94ff;
}

.notification-badge {
  background-color: #ff4d4d;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 1rem;
  margin-left: 0.5rem;
  display: inline-block;
  line-height: 1;
}

.status-dot {
  width: 10px;
  height: 10px;
  background-color: #f44336; /* Default offline color */
  border-radius: 50%;
  position: absolute;
  top: 24%;
  left: 7.5%;
  transform: translateX(-50%);
  transition: background-color 0.3s ease;
}

.status-dot.online {
  background-color: #4caf50; /* Green for online */
}

.fa {
  font-size: 1.5rem;
  color: #cccccc;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.chat-card:hover .fa {
  opacity: 1;
}

.fa-thumbtack {
  color: #f39c12; /* Yellow color for pinned icon */
  opacity: 1;
}

.fa-palette {
  color: #cccccc; /* Default color for non-pinned icon */
}

.mention-badge {
  background-color: #ffcc00; /* Bright yellow for mentions */
  color: #1a1a1a; /* Dark text for contrast */
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 0.5rem;
  display: inline-block;
  line-height: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: pulse 1.5s infinite; /* Subtle pulsing effect */
}

.unread-dot {
  background-color: #ff4d4d; /* Bright red for unread messages */
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 0.5rem;
  display: inline-block;
  line-height: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Add a pulsing animation for the mention badge */
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}
</style>