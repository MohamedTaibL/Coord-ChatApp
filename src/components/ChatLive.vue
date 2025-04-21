<template>
  <div class="message-container">
    <!-- Messages -->
    <div class="messages-area" id="messages-area">
      <div v-for="message in messages" :key="message.id"
        :class="['message-wrapper', message.sender === currentUserId ? 'my-message-wrapper' : 'other-message-wrapper']">
        <img v-if="message.sender !== currentUserId" class="profile-img" :src="message.senderData?.imgURL"
          :alt="message.senderData?.name || 'User'" />
        <div class="message-content">
          <div class="sender-info" v-if="message.sender !== currentUserId">
            {{ message.senderData?.name || 'Unknown' }}
          </div>
          <div class="message-row">
            <div :class="['message', message.sender === currentUserId ? 'my-message' : 'other-message']">
              <!-- Message Text or Editable Input -->
              <div v-if="isEditing && message.id === editingMessageId">
                <input v-model="editedMessageText" type="text" class="message-input" placeholder="Edit your message" />
              </div>
              <div v-else>
                {{ message.content }}
              </div>
            </div>
            <div class="message-actions">
              <!-- Edit Button (only for current user's messages) -->
              <button v-if="message.sender === currentUserId && !isEditing" class="edit-button"
                @click="editMessage(message)" aria-label="Edit message">
                ✏️
              </button>
              <!-- Submit Button (appears when in edit mode) -->
              <button v-if="message.sender === currentUserId && isEditing && message.id === editingMessageId"
                class="submit-button" @click="submitEdit(message.id)" aria-label="Submit edited message">
                ✅
              </button>
              <button v-if="message.sender === currentUserId && !isEditing" class="delete-button"
                @click="deleteMessage(message.id)" aria-label="Delete message">
                🗑️
              </button>

              <!-- Like Button -->
              <button class="like-button" :aria-label="message.liked ? 'Unlike message' : 'Like message'"
                 @click="toggleLike(message)">
                ❤️ {{ message.likesCount }}
              </button>
            </div>
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { db, auth } from '@/Firebase/config'
import { useRoute, useRouter } from 'vue-router'
import firebase from 'firebase/app'

const props = defineProps({
  placeholder: { type: String, default: 'Type your message...' },
  chat: { type: Object, default: () => ({}) }
})

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

const emojis = [
  '😊','😂','🥰','😍','😎','👍','🔥','💖','🙏','✨',
  '🥺','😭','🤔','🤗','😉','🎉','👌','💯','🌟','😴'
]

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

const sendFirstMessage = async () => {
  const currentUserID = auth.currentUser.uid
  const otherUserID = route.params.id
  const membersArray = otherUserID !== currentUserID ? [currentUserID, otherUserID] : [currentUserID]

  const chatRef = await db.collection('chats').add({
    participants: membersArray,
    isGroup: false,
    isCommunity: false
  })
  const messageRef = await db.collection('messages').add({
    sender: currentUserID,
    content: messageText.value.trim(),
    likes: [],
    editDate: null
  })

  await chatRef.update({
    messages: [...messages.value, messageRef.id]
  })

  return messageRef.id
}

const setupMessageListener = () => {
  if (!props.chat.id) return
  unsubscribeMessages.value?.()

  unsubscribeMessages.value = db.collection('chats')
    .doc(props.chat.id)
    .onSnapshot(async doc => {
      if (!doc.exists) {
        messages.value = []
        return
      }

      const ids = doc.data().messages || []

      const docs = await Promise.all(
        ids.map(id =>
          db.collection('messages').doc(id).get().then(d =>
            d.exists ? { id: d.id, ...d.data() } : null
          )
        )
      )

      const enriched = await enrichMessagesWithSender(docs.filter(Boolean))
      messages.value = enriched.sort((a, b) =>
        a.timestamp?.seconds - b.timestamp?.seconds ||
        a.timestamp?.nanoseconds - b.timestamp?.nanoseconds
      )
    }, e => console.error('Listener error:', e))
}

const deleteMessage = async (messageId) => {
  try {
    const chatRef = db.collection('chats').doc(props.chat.id)
    await chatRef.update({
      messages: firebase.firestore.FieldValue.arrayRemove(messageId)
    })
    await db.collection('messages').doc(messageId).delete()
  } catch (e) {
    console.error('Delete message error:', e)
  }
}

const sendMessage = async () => {
  const txt = messageText.value.trim()
  if (!txt || !auth.currentUser) return

  try {
    if (route.name === 'new') {
      await sendFirstMessage()
    } else {
      const msgRef = await db.collection('messages').add({
        sender: currentUserId,
        content: txt,
        likes: [],
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })

      await db.collection('chats').doc(props.chat.id).update({
        messages: firebase.firestore.FieldValue.arrayUnion(msgRef.id)
      })

      messageText.value = ''
    }
  } catch (e) {
    console.error('Send error:', e)
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

const handleClickOutside = (ev) => {
  if (showEmojiPicker.value && !ev.target.closest('.emoji-button, .emoji-picker')) {
    showEmojiPicker.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (props.chat.id) {
    loadInitialMessages(props.chat.id)
    setupMessageListener()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  unsubscribeMessages.value?.()
})

watch(() => props.chat, async (c) => {
  if (c.id) {
    messages.value = []
    await loadInitialMessages(c.id)
    setupMessageListener()
  }
}, { immediate: true, deep: true })
</script>
<style scoped>
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

  .message {
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    word-break: break-word;
  }

  .my-message {
    background-color: #dcf8c6;
    color: #111;
    align-self: flex-end;
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

  
</style>
 