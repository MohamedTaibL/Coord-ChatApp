<template>
    <div class="message-container">
      <!-- Reserved area for messages -->
      <div class="messages-area" id="messages-area">
        <!-- This div will be used to display messages -->
      </div>
      
      <!-- Input area with emoji picker and send button -->
      <div class="input-area">
        <div class="input-wrapper">
          <button 
            class="emoji-button" 
            @click="toggleEmojiPicker"
            aria-label="Choose emoji"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </button>
          
          <input 
            type="text" 
            class="message-input"
            placeholder="Type your message..."
            v-model="messageText"
            @keyup.enter="sendMessage"
            ref="inputField"
          />
          
          <button 
            class="send-button" 
            @click="sendMessage"
            :disabled="!messageText.trim()"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        
        <!-- Emoji picker (hidden by default) -->
        <div class="emoji-picker" v-if="showEmojiPicker">
          <div class="emoji-grid">
            <button 
              v-for="emoji in emojis" 
              :key="emoji" 
              class="emoji-item"
              @click="addEmoji(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted , watch } from 'vue'
  import {db , auth} from '@/Firebase/config'
  import { useRoute , useRouter } from 'vue-router'
  

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Type your message...'
  },
  chat: {
    type: Array,
    default: () => []
  }

})




  
  // State
  const messageText = ref('')
  const showEmojiPicker = ref(false)
  const inputField = ref(null)
  const route = useRoute()
  const router = useRouter()
  
  // Common emojis
  const emojis = [
    '😊', '😂', '🥰', '😍', '😎',
    '👍', '🔥', '💖', '🙏', '✨',
    '🥺', '😭', '🤔', '🤗', '😉',
    '🎉', '👌', '💯', '🌟', '😴'
  ]

  const sendFirstMessage = async () =>{
    const currentUserID =  auth.currentUser.uid
    const otherUserID = route.params.id
    const membersArray = otherUserID != currentUserID ? [currentUserID , otherUserID] : [currentUserID]
    try{
    const chatRef = await db.collection("chats").add({
        participants : membersArray,
        isGroup : false,
        isCommunity : false
    })

    const messageRef = await db.collection("messages").add({
        sender : currentUserID,
        content : messageText.value.trim(),
        likes : [],
        editDate : null
    })



    await chatRef.update({
        messages : [... props.chat.messages , messageRef.id]
    })



    }
    catch(error){
        alert("Something went wrong")
    }
}
  
  // Methods
  const sendMessage = async () => {
    const trimmedMessage = messageText.value.trim()
    if (trimmedMessage) {
      messageText.value = ''
      if (route.name == "new"){
        sendFirstMessage();
      }
      else{
        const msgRef = await db.collection("messages").add({
            sender : auth.currentUser.uid,
            content : trimmedMessage,
            likes : []
        })
        
        await db.collection("chats").doc(props.chat.id).update({
            messages : [...props.chat.messages , msgRef.id]
            
        })
      }
      
      }
    }

  
  const toggleEmojiPicker = () => {
    showEmojiPicker.value = !showEmojiPicker.value
  }
  
  const addEmoji = (emoji) => {
    messageText.value += emoji
    focusInput()
  }
  
  const focusInput = () => {
    if (inputField.value) {
      inputField.value.focus()
    }
  }
  
  // Close emoji picker when clicking outside
  const handleClickOutside = (event) => {
    if (showEmojiPicker.value) {
      // Check if the click is outside the emoji picker
      const isClickInsideEmojiButton = event.target.closest('.emoji-button')
      const isClickInsideEmojiPicker = event.target.closest('.emoji-picker')
      
      if (!isClickInsideEmojiButton && !isClickInsideEmojiPicker) {
        showEmojiPicker.value = false
      }
    }
  }



  
  // Lifecycle hooks
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    focusInput()
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
  </script>
  
  <style>
  .message-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 900px;
    margin: 0 auto;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    /* You can style this further for your message display */
  }
  
  .input-area {
    position: relative;
    padding: 1rem;
    border-top: 1px solid #eaeaea;
    width:900px;
  }
  
  .input-wrapper {
    display: flex;
    align-items: center;
    background-color: #f9fafb;
    border-radius: 24px;
    border: 1px solid #e5e7eb;
    padding: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
  }
  
  .input-wrapper:focus-within {
    border-color: #a855f7;
    box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
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
  
  .message-input::placeholder {
    color: #9ca3af;
  }
  
  .emoji-button, .send-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .emoji-button:hover, .send-button:hover {
    background-color: #f3e8ff;
    color: #a855f7;
  }
  
  .send-button {
    background-color: #a855f7;
    color: white;
  }
  
  .send-button:hover {
    background-color: #9333ea;
    color: white;
  }
  
  .send-button:disabled {
    background-color: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }
  
  .emoji-picker {
    position: absolute;
    bottom: 80px;
    left: 1rem;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    padding: 0.75rem;
    z-index: 10;
    border: 1px solid #e5e7eb;
    max-width: 300px;
    animation: fadeIn 0.2s ease;
  }
  
  .emoji-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
  }
  
  .emoji-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    border: none;
    background: transparent;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  
  .emoji-item:hover {
    background-color: #f3e8ff;
    transform: scale(1.1);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    .input-wrapper {
      border-radius: 20px;
    }
    
    .emoji-button, .send-button {
      width: 36px;
      height: 36px;
    }
    
    .message-input {
      font-size: 0.9rem;
    }
  }
  </style>