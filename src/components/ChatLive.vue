<template>
  <div class="message-container" v-if="!isInvitation">
    <div class="nav-buttons">
      <button 
        v-if="matches.length > 0" 
        @click="navigateToMatch('up')" 
        :disabled="currentMatchIndex === 0"
      >
        ↑
      </button>
      <button 
        v-if="matches.length > 0" 
        @click="navigateToMatch('down')" 
        :disabled="currentMatchIndex === matches.length - 1" 
      >
        ↓
      </button>
    </div>
    <!-- Messages -->
    <div class="messages-area" id="messages-area">
      <div 
        v-for="message in messages"
        :id="message.id"
        :class="['message-wrapper', message.sender === currentUserId ? 'my-message-wrapper' : 'other-message-wrapper', matches.includes(message.id) ? 'highlighted' : '', matches[currentMatchIndex] === message.id ? 'current-match' : '']"
        >

        <img v-if="message.sender !== currentUserId" class="profile-img" :src="message.senderData?.imgURL"
          :alt="message.senderData?.name || 'User'" />
        <div class="message-content">

          <div class="sender-info" v-if="message.sender !== currentUserId">
            {{ message.senderData?.name || 'Unknown' }}
          </div>

          <div class="message-row">
            <!-- Edit/Delete (Only for current user's messages) -->
            <div v-if="message.sender === currentUserId && !isEditing" class="message-tools">
              <button class="edit-button" @click="editMessage(message)" aria-label="Edit message">
                <i class="fa fa-pencil edit-button" title="Edit"></i>
              </button>
              <button class="delete-button" @click="deleteMessage(message.id)" aria-label="Delete message">
                <i class="fa fa-trash delete-button" title="Delete"></i>
              </button>
            </div>

            <div :class="['message', message.sender === currentUserId ? 'my-message' : 'other-message']">
              <!-- Message Text or Editable Input -->
              <div v-if="isEditing && message.id === editingMessageId">
                <input v-model="editedMessageText" type="text" class="message-input" placeholder="Edit your message"/>
                <button class="submit-button" @click="submitEdit(message.id)" aria-label="Submit edited message">
                  <i class="fa fa-check submit-button" title="submit"></i>
                </button>
              </div>
              <div class="messageContent" v-else>
                {{ message.content }}
              </div>
            </div>
          </div>
          <!-- Like button (aligned below or corner) -->
          <div class="like-button-wrapper">
            <button class="like-button" :aria-label="message.liked ? 'Unlike message' : 'Like message'" @click="toggleLike(message)">
              <span :class="{ liked: message.liked }">❤️</span> {{ message.likesCount }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-area">
      <div class="input-wrapper">
        <button class="emoji-button" @click="toggleEmojiPicker" aria-label="Choose emoji">
          <!-- emoji icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
            stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>

        <input type="text" class="message-input" :placeholder="props.placeholder" v-model="messageText"
          @keyup.enter="sendMessage" ref="inputField" />

        <button class="send-button" @click="sendMessage" :disabled="!messageText.trim()" aria-label="Send message">
          <!-- send icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
            stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <!-- Emoji Picker -->
      <div class="emoji-picker" v-if="showEmojiPicker">
        <div class="emoji-grid">
          <button v-for="emoji in emojis" :key="emoji" class="emoji-item" @click="addEmoji(emoji)">
            {{ emoji }}
          </button>
        </div>
      </div>
    </div>
  </div>


  <div v-else class="invitation-container">
    <div class="invitation-card">
      <div class="invitation-header">
        <div class="sparkles sparkles-left">✨</div>
        <h2>Group Invitation</h2>
        <div class="sparkles sparkles-right">✨</div>
      </div>
      
      <div class="invitation-content">
        <div class="avatar-container">
          <div class="avatar-circle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        </div>
        
        <p class="invitation-message">
          You have been invited to join this group!
        </p>
        
        <div class="invitation-actions">
          <button class="accept-btn" @click="accept">Accept Invitation</button>
          <button class="decline-btn" @click="decline">Decline Invitation</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { db, auth } from '@/Firebase/config'
import { useRoute, useRouter } from 'vue-router'
import firebase from 'firebase/app'
import { nextTick } from 'vue'

const props = defineProps({
  placeholder: { type: String, default: 'Type your message...' },
  chat: { type: Object, default: () => ({}) },
  search: { type : String, default : ''},
  isInvite: Boolean,
})

const searchQuery = ref(props.search);
const matches = ref([]);
const currentMatchIndex = ref(-1);
const messageText = ref('')
const editedMessageText = ref('')
const showEmojiPicker = ref(false)
const inputField = ref(null)
const route = useRoute()
const router = useRouter()
const messages = ref([])
const unsubscribeMessages = ref(null)
const currentUserId = auth.currentUser?.uid || ''

const isEditing = ref(false)
const editingMessageId = ref(null)
const isInvitation = ref(false)

const emojis = [
  '😊','😂','🥰','😍','😎','👍','🔥','💖','🙏','✨',
  '🥺','😭','🤔','🤗','😉','🎉','👌','💯','🌟','😴'
]


watch(() => props.search, (newQuery) => {
  searchQuery.value = newQuery;
  onSearchInput();
});

const onSearchInput = () => {
  searchAndUpdateMatches(searchQuery.value);
};

const searchAndUpdateMatches = (query) => {
  if (!query) {
    matches.value = [];
    currentMatchIndex.value = -1;
    return;
  }

  matches.value = messages.value
  .filter(msg => msg.content.toLowerCase().includes(query.toLowerCase()))
  .map(msg => msg.id);

  // Reset the current match index after each new search
  currentMatchIndex.value = matches.value.length-1;

  console.log("newMatches : ", matches.value)

  highlightMatches();
};

// Highlight matching elements
const highlightMatches = () => {
  if (matches.value.length > 0) {
    scrollToCurrentMatch();
  }
};

const scrollToCurrentMatch = () => {
  const currentId = matches.value[currentMatchIndex.value];
  const el = document.getElementById(currentId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const navigateToMatch = (direction) => {
  if (direction === 'up' && currentMatchIndex.value > 0) {
    currentMatchIndex.value--;
  } else if (direction === 'down' && currentMatchIndex.value < matches.value.length - 1) {
    currentMatchIndex.value++;
  }
  scrollToCurrentMatch();
};


const fetchSenderData = async (uid) => {
  try {
    const doc = await db.collection('users').doc(uid).get()
    return doc.exists ? doc.data() : null
  } catch (e) {
    console.error('User fetch error:', e)
    return null
  }
}

const enrichMessagesWithSender = async (msgs) => {
  const enriched = await Promise.all(
    msgs.map(async (msg) => {
      const senderData = await fetchSenderData(msg.sender)
      // Add likesCount and liked properties
      return {
        ...msg,
        senderData,
        likesCount: msg.likes ? msg.likes.length : 0,
        liked: msg.likes && msg.likes.includes(currentUserId)
      }
    })
  )
  return enriched
}

const loadInitialMessages = async (chatId) => {
  try {
    const chatDoc = await db.collection('chats').doc(chatId).get()
    if (!chatDoc.exists) { messages.value = []; return }

    const chatData = chatDoc.data()
    if (!chatData.messages?.length) { messages.value = []; return }

    const docs = await Promise.all(
      chatData.messages.map(id =>
        db.collection('messages').doc(id).get().then(d => d.exists ? { id: d.id, ...d.data() } : null)
      )
    )

    messages.value = await enrichMessagesWithSender(
      docs.filter(m => m)
        .sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds || a.timestamp?.nanoseconds - b.timestamp?.nanoseconds)
    )
  } catch (e) {
    console.error('Load messages error:', e)
    messages.value = []
  }
}

const deleteMessage = async (messageId) => {
  try {
    alert("are you sure you want to delete this message?");
    const chatRef = db.collection('chats').doc(props.chat.id)
    await chatRef.update({
      messages: firebase.firestore.FieldValue.arrayRemove(messageId)
    })
    await db.collection('messages').doc(messageId).delete()
  } catch (e) {
    console.error('Delete message error:', e)
  }
}


const sendFirstMessage = async (txt) => {
  const currentUserID = auth.currentUser.uid;
  const otherUserID = route.params.id;

  const isSelfChat = currentUserID === otherUserID;
  const expectedParticipants = isSelfChat ? [currentUserID] : [currentUserID, otherUserID];

  // Fetch all possible chats where otherUserID is involved
  const existingChatSnap = await db.collection('chats')
    .where('participants', 'array-contains', otherUserID)
    .where('isGroup', '==', false)
    .where('isCommunity', '==', false)
    .get();

  let chatRef = null;

  if (!existingChatSnap.empty) {
    // Look through all matching chats to find one with exactly the expected participants
    for (const doc of existingChatSnap.docs) {
      const participants = doc.data().participants;
      if (participants.length === expectedParticipants.length &&
          expectedParticipants.every(p => participants.includes(p))) {
        chatRef = db.collection('chats').doc(doc.id);
        break;
      }
    }
  }

  // If no matching chat was found, create a new one
  if (!chatRef) {
    chatRef = await db.collection('chats').add({
      participants: expectedParticipants,
      isGroup: false,
      isCommunity: false
    });
  }

  // Get the chat snapshot
  const chatSnap = await chatRef.get();
  props.chat.value = { id: chatSnap.id, ...chatSnap.data() };

  // Add the message to the "messages" collection
  const msgRef = await db.collection('messages').add({
    sender: currentUserID,
    content: txt,
    likes: [],
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    chatId: chatRef.id
  });

  // Add the message reference to the chat
  await chatRef.update({
    messages: firebase.firestore.FieldValue.arrayUnion(msgRef.id)
  });

  // Extract mentioned usernames (if any)
  const mentionedUsernames = extractMentionedUsernames(txt);

  // Create notifications for the message and mentions
  await createNewMessageNotification(txt, msgRef.id);
  await createNotificationsForMentions(mentionedUsernames, msgRef.id);

  return msgRef.id;
};

const setupMessageListener = () => {
  if (!props.chat.id) return;
  unsubscribeMessages.value?.();

  unsubscribeMessages.value = db.collection('chats')
    .doc(props.chat.id)
    .onSnapshot(async doc => {
      if (!doc.exists) {
        messages.value = [];
        return;
      }

      const ids = doc.data().messages || [];

      const docs = await Promise.all(
        ids.map(id =>
          db.collection('messages').doc(id).get().then(d =>
            d.exists ? { id: d.id, ...d.data() } : null
          )
        )
      );
    
    // 
    const enriched = await enrichMessagesWithSender(docs.filter(Boolean));
    messages.value = enriched.sort((a, b) =>
      a.timestamp?.seconds - b.timestamp?.seconds ||
      a.timestamp?.nanoseconds - b.timestamp?.nanoseconds
    );

    const currentUserDoc = await db.collection('users').doc(currentUserId).get();
    const inbox = currentUserDoc.data()?.Inbox || [];

    const chatNotifs = inbox
    .filter(n => n.chatId === props.chat.id)
    .sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds || 0);

    if (chatNotifs.length) {
    const firstMessageId = chatNotifs[0].messageId;

    // Wait for DOM to render
    nextTick(() => {
      const el = document.querySelector(`[data-message-id="${firstMessageId}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    }

    await markNotificationsAsRead(props.chat.id);

    }, e => console.error('Listener error:', e));
}

const extractMentionedUsernames = ((messageText) => {
    let mentionedUsernames = []
    
    // Extract mentions (@username) from the message content
    const mentionPattern = /@([a-zA-Z0-9_]+)/g
    const mentions = messageText.match(mentionPattern)
    if (mentions) {
      mentionedUsernames = mentions.map(m => m.slice(1)) // Remove '@' symbol
    }

    return mentionedUsernames;
})

const sendMessage = async () => {
  const txt = messageText.value.trim()
  if (!txt || !auth.currentUser) return

  try {
    if (route.name === 'new') {
      // Send first message in a new chat
      await sendFirstMessage(txt);
    } else {
      // Send message in existing chat
      const msgRef = await db.collection('messages').add({
        sender: currentUserId,
        content: txt,
        likes: [],
        chatId: props.chat.id,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })

      await db.collection('chats').doc(props.chat.id).update({
        messages: firebase.firestore.FieldValue.arrayUnion(msgRef.id)
      })

      // Create notifications for mentions in this message
      const mentionedUsernames = extractMentionedUsernames(txt);
      await createNotificationsForMentions(mentionedUsernames, msgRef.id)

      messageText.value = ''
      await createNewMessageNotification(txt, msgRef.id);
    }
  } catch (e) {
    console.error('Send error:', e)
  }
}

const createNotificationsForMentions = async (mentionedUsernames, messageId) => {
  // Loop through all mentioned usernames
  for (const username of mentionedUsernames) {
    try {
      // Fetch the user data based on the username
      const userSnapshot = await db.collection('users').where('username', '==', username).get()
      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0]
        const userId = userDoc.id

        // Add notification to the user's Inbox
        const notification = {
          messageId,
          type: 'mention',
          timestamp: new Date(),
          senderId: currentUserId,
          chatId: props.chat.id
        }

        // Update the user's Inbox with the new notification
        await db.collection('users').doc(userId).update({
          Inbox: firebase.firestore.FieldValue.arrayUnion(notification)
        })
      }
    } catch (e) {
      console.error('Notification creation error:', e)
    }
  }
}


const toggleLike = async (message) => {
  try {
    const messageRef = db.collection('messages').doc(message.id)
    const messageSnap = await messageRef.get()
    if (!messageSnap.exists) return

    const messageData = messageSnap.data()
    const likes = messageData.likes || []
    const userId = currentUserId

    // Update the UI immediately
    const messageIndex = messages.value.findIndex(m => m.id === message.id)
    if (messageIndex === -1) return

    if (likes.includes(userId)) {
      // Unlike: remove user ID from likes array
      const updatedLikes = likes.filter(id => id !== userId)
      
      // Update Firebase
      await messageRef.update({
        likes: firebase.firestore.FieldValue.arrayRemove(userId)
      })
      
      // Update local state immediately
      messages.value[messageIndex].likes = updatedLikes
      messages.value[messageIndex].likesCount = updatedLikes.length
      messages.value[messageIndex].liked = false
    } else {
      // Like: add user ID to likes array
      const updatedLikes = [...likes, userId]
      
      // Update Firebase
      await messageRef.update({
        likes: firebase.firestore.FieldValue.arrayUnion(userId)
      })
      
      // Update local state immediately
      messages.value[messageIndex].likes = updatedLikes
      messages.value[messageIndex].likesCount = updatedLikes.length
      messages.value[messageIndex].liked = true
    }
  } catch (e) {
    console.error('Toggle like error:', e)
  }
}

const toggleEmojiPicker = () => (showEmojiPicker.value = !showEmojiPicker.value)
const addEmoji = (e) => { messageText.value += e; inputField.value?.focus() }

const editMessage = (message) => {
  isEditing.value = true
  editingMessageId.value = message.id
  editedMessageText.value = message.content
}

const submitEdit = async (messageId) => {
  try {
    const msgSnap = await db.collection('messages').doc(messageId).get()
    const oldMsg = msgSnap.data()

    const newMsgRef = await db.collection('messages').add({
      content: editedMessageText.value,
      sender: oldMsg.sender,
      likes: [],
      timestamp: oldMsg.timestamp,
      edited: true,
      editedAt: firebase.firestore.FieldValue.serverTimestamp()
    })

    const chatRef = db.collection('chats').doc(props.chat.id)
    await chatRef.update({
      messages: firebase.firestore.FieldValue.arrayRemove(messageId)
    })
    await chatRef.update({
      messages: firebase.firestore.FieldValue.arrayUnion(newMsgRef.id)
    })

    await db.collection('messages').doc(messageId).delete()

    isEditing.value = false
    editingMessageId.value = null
  } catch (e) {
    console.error('Edit submit error:', e)
  }
}

const markNotificationsAsRead = async (chatId) => {
  try {
    const currentUserId = auth.currentUser?.uid;
    if (!currentUserId) return;

    const userDoc = await db.collection('users').doc(currentUserId).get();
    const userData = userDoc.data();
    if (!userData || !userData.Inbox) return;

    // Filter out notifications that belong to this chatId
  

    //
    const updatedInbox = userData.Inbox.filter(notification => notification.chatId !== chatId);

    await db.collection('users').doc(currentUserId).update({
      Inbox: updatedInbox
    });

  } catch (e) {
    console.error('Error marking notifications as read:', e);
  }
}

const createNewMessageNotification = async (newMessage, messageId) => {
  try {
    const notification = {
      messageId,
      type: 'message',
      timestamp: new Date(),
      senderId: currentUserId,
      chatId: props.chat.id
    }

    // the msg should be sent as a notif to all users in the props.chat.participants
    if(props.chat?.participants)
      for(let recipientId of props.chat.participants){
        // Add notification to the user's Inbox
        if(recipientId != auth.currentUser.uid)
          await db.collection('users').doc(recipientId).update({
            Inbox: firebase.firestore.FieldValue.arrayUnion(notification)
          })
      }
  } catch (e) {
    console.error('Create notification error:', e)
  }
}

const handleClickOutside = (ev) => {
  if (showEmojiPicker.value && !ev.target.closest('.emoji-button, .emoji-picker')) {
    showEmojiPicker.value = false
  }
}






//This is the code for the accepting/declining part

const accept = async () =>{
  try{
  await db.collection('users').doc(auth.currentUser.uid).update({
    invitations: firebase.firestore.FieldValue.arrayRemove(props.chat.id),
    chats: firebase.firestore.FieldValue.arrayUnion(props.chat.id)
  })

  await db.collection('chats').doc(props.chat.id).update({
    participants: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid)
  })
  isInvitation.value = false

  }
  catch(e){
    alert("Something has went wrong. Please try again later.")
  }

}
const decline = async () =>{
  try{
  await db.collection('users').doc(auth.currentUser.uid).update({
    invitations: firebase.firestore.FieldValue.arrayRemove(props.chat.id)
  })
  window.location.reload()
  }
  catch(e){
    alert("Something has went wrong. Please try again later.")
  }
}


onMounted(() => {
  isInvitation.value = props.isInvite

  document.addEventListener('click', handleClickOutside)
  if(props.chat.id){
    loadInitialMessages(props.chat.id)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  unsubscribeMessages.value?.()
})


watch(() => props.chat, async (c) => {
  if (c && c.id) {
    messages.value = []
    setupMessageListener()
  }
}, { immediate: true, deep: true })

watch(() => props.isInvite, (newVal) => {
  isInvitation.value = newVal
})

</script>

<style scoped>

.highlighted .messageContent {
  background-color: #ffeaa7; /* Light yellow */
  transition: background-color 0.5s;
}

.current-match .messageContent {
  background-color: #fdcb6e; /* Slightly darker yellow */
}


  .message-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
    overflow: hidden; /* Ensure no overflow here either */
    font-family: 'Inter', sans-serif;
  }
  .messages-area {
  flex-grow: 1;
  overflow-y: auto; /* Updated from scroll to auto */
  padding: 1rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: calc(100vh - 70px);
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;
}

/* Optional: Custom scrollbar styling */
.messages-area::-webkit-scrollbar {
  width: 8px; /* Increased width for better visibility */
}

.messages-area::-webkit-scrollbar-track {
  background: transparent;
}

.messages-area::-webkit-scrollbar-thumb {
  background-color: #b0b0b0;
  border-radius: 10px;
}

  .message-wrapper {
    display: flex;
    align-items: flex-start;
    margin-bottom: 0.75rem;
    margin-right: 2rem;
  }

  .my-message-wrapper {
    justify-content: flex-end;
  }

  .profile-img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 0.75rem;
  }

  .message-content {
    max-width: 80%;
  }

  .sender-info {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }

  .message-row {
    display: flex;
    flex-direction: row;
    gap: 4px;
  }

  .message {
    position: relative;
    padding: 10px 14px;
    border-radius: 16px;
    max-width: 75%;
    word-break: break-word;
    background-color: #f1f1f1;
  }

  .my-message {
    background-color: #d1e7dd;
  }

  .message-tools {
    display: flex;
    flex-direction: row;
    gap: 4px;
  }

  .submit-button {
    background: transparent;
    border: none;
    font-size: 14px;
    cursor: pointer;
    color: #666;
  }

  .edit-button,
  .delete-button {
    background: transparent;
    border: none;
    font-size: 14px;
    cursor: pointer;
    color: #666;
    opacity: 0; 
  }

  .message-row:hover{
    .edit-button , .delete-button {
      opacity : 1;
    }
  }

  .like-button-wrapper {
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
  }

  .my-message-wrapper .like-button-wrapper {
    justify-content: flex-end;
  }

  .like-button {
    background: transparent;
    border: none;
    cursor: pointer;
    color: #e25555;
    display: flex;
    align-items: center;
    font-size: 16px;
  }

  .like-button .liked {
    animation: pop 0.3s ease;
    color: #d40000;
  }

  @keyframes pop {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }

  .other-message {
    background-color: #ffffff;
    color: #333;
    align-self: flex-start;
  }

  .input-area {
    position: relative;
    padding: 1rem;
    width: 100%;
    display: flex;
    justify-content: center; /* Center the input horizontally */
    background-color: #dcf0f9; /* Match background */
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    background-color: #f9fafb;
    border-radius: 24px;
    border: 1px solid #e5e7eb;
    padding: 0.5rem;
    width: 100%;
    max-width: 800px; /* Adjust as needed */
  }

  .input-wrapper:focus-within {
    border-color: #a855f7;
  }

  .message-input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 0.75rem;
    font-size: 1rem;
    color: #374151;
    outline: none;
  }

  .emoji-button,
  .send-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: transparent;
    color: #6b7280;
    cursor: pointer;
  }

  .send-button {
    background-color: #a855f7;
    color: white;
  }

  .send-button:disabled {
    background-color: #e5e7eb;
    color: #9ca3af;
  }

  .emoji-picker {
    position: absolute;
    bottom: 60px; /* Adjust as needed depending on input height */
    left: 0; /* Align with left edge of input */
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    z-index: 10;
    width: max-content; /* Ensures it doesn't overflow weirdly */
  }

  .emoji-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
  }

  .emoji-item {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
    border-radius: 8px;
    cursor: pointer;
  }

  .emoji-item:hover {
    background-color: #f3e8ff;
    transform: scale(1.1);
  }

  .invitation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2rem;
  background-color: #f0f9ff;
}

.invitation-card {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transform: translateY(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding-bottom: 2rem;
}

.invitation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.invitation-header {
  background: linear-gradient(135deg, #a78bfa, #1114d6);
  color: white;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.invitation-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
}

.sparkles {
  position: absolute;
  font-size: 1.5rem;
  animation: sparkle 1.5s infinite alternate;
}

.sparkles-left {
  left: 30px;
  animation-delay: 0.2s;
}

.sparkles-right {
  right: 30px;
  animation-delay: 0.7s;
}

@keyframes sparkle {
  0% { transform: scale(1) rotate(0deg); opacity: 0.7; }
  100% { transform: scale(1.2) rotate(15deg); opacity: 1; }
}

.invitation-content {
  padding: 2rem;
  text-align: center;
}

.avatar-container {
  margin-bottom: 1.5rem;
}

.avatar-circle {
  width: 90px;
  height: 90px;
  background-color: #f3f4f6;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #e0e7ff;
}

.avatar-circle svg {
  width: 45px;
  height: 45px;
  color: #8b5cf6;
}

.invitation-message {
  font-size: 1.25rem;
  color: #4b5563;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.invitation-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.accept-btn, .decline-btn {
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  width: 100%;
}

.accept-btn {
  background-color: #4a37f1;
  color: white;
}

.accept-btn:hover {
  background-color: #340881;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.decline-btn {
  background-color: transparent;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.decline-btn:hover {
  background-color: #f9fafb;
  color: #4b5563;
}

/* Animation for buttons */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
}

.accept-btn:focus {
  animation: pulse 1.5s infinite;
}

</style>
 