<template>
  <div class="chat-bar">
    <div class="user-info">
      <img :src=" chat ? (chat.picture ? chat.picture : defaultAvatar) : defaultAvatar" class="avatar" />
      <div class="status-dot" :class="{ online: isOnline }"></div>
      <div class="user-meta">
      <strong style="display:flex; justify-content: flex-start;">{{ chat ? chat.name : 'user1' }}</strong>
      <small style="display:flex; justify-content: flex-start;">{{ chat ? chat.bio : 'username' }}</small>
      </div>
    </div>
    <input class="chat-search" type="text" v-model="searchQuery" placeholder="search the chat ..." />
    <i class="fa fa-ellipsis-v menu-icon"></i>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const props = defineProps({
  chat: Object,
  isOnline: Boolean
})

const searchQuery = ref('')
</script>

<style scoped>

.user-info {
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-meta strong {
  color: #ffffff;
  font-size: 0.95rem;
  line-height: 1.2;
}

.user-meta small {
  color: #ccc;
  font-size: 0.75rem;
}

.chat-bar {
display: flex;
align-items: center;
background-color: #081e5e;
border-left: 1px solid #1c2636;
padding: 0.75rem 1rem;
box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
justify-content: space-between;
}

.chat-search {
background-color: #0d1a33;
color: #fff;
border: none;
border-radius: 0.5rem;
padding: 0.5rem 0.75rem;
width: 50%;
margin: 0 auto;
}


.chat-search::placeholder {
  color: #aaa;
}

.menu-icon {
  font-size: 1.25rem;
  color: #ccc;
  margin-left: 1rem;
  cursor: pointer;
}
</style>
