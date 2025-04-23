<template>
  <div class="chat-bar">
    <div class="user-info">
      <img :src="chat ? (chat.picture ? chat.picture : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y') : defaultAvatar" class="avatar" />
      <div class="user-meta">
        <strong style="display:flex; justify-content: flex-start;">{{ chat ? chat.name : 'user1' }}</strong>
        <small style="display:flex; justify-content: flex-start;">
          {{ chat && chat.bio ? (chat.bio.length > 50 ? chat.bio.slice(0, 50) + '...' : chat.bio) : 'username' }}
        </small>
      </div>
    </div>
    <input class="chat-search" type="text" v-model="searchQuery" placeholder="search the chat ..." />
    <i class="fa fa-ellipsis-v menu-icon"></i>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  chat: Object,
  isCommunity: Boolean,
  isGroup: Boolean
});

const emit = defineEmits(['search']);

const searchQuery = ref('');

// Watch searchQuery and emit when it changes
watch(searchQuery, (newValue) => {
  emit('search', newValue);
});
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  margin-right: 1rem;
  position: relative; /* Ensure status dot is positioned relative to this container */
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
  position: sticky;
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

/* Status Dot for online/offline */
.status-dot {
  width: 10px;
  height: 10px;
  background-color: #f44336; /* Default offline color */
  border-radius: 50%;
  position: absolute;
  top: 0; /* Position the dot on the top of the avatar */
  left: -3%; /* Position it on the right side of the avatar */
  transform: translateX(50%); /* Fine-tune the position */
  transition: background-color 0.3s ease;
}

.status-dot.online {
  background-color: #4caf50; /* Green for online */
}
</style>
