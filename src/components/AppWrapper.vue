<template>
    <div class="chat-app-wrapper">
      <ChatsList  />
      <NoChat v-if="noChat"/>
      <MainChat v-else />
    </div>
</template>
  
<script setup>
import ChatsList from '@/components/ChatsList.vue'
import MainChat from '@/components/MainChat.vue'
import NoChat from '@/components/NoChat.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const noChat = ref(true)

watch(() => route.params.id, (id) => {
  noChat.value = !id
})
</script>

<style scoped>
.chat-app-wrapper {
  display: flex;
  height: 100vh; /* Full viewport height */
  overflow: hidden;
}

/* ChatsList (sidebar) */
.chat-app-wrapper > *:first-child {
  max-width: 320px; /* or whatever matches your design */
  border-right: 1px solid #1c2636;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* MainChat (right panel) */
.chat-app-wrapper > *:last-child {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>
