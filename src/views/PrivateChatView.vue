<template>
    <div class="chat-app-wrapper">
      <ChatsList @active="ActiveChat = $event" />
      <NoChat v-if="!ActiveChat" />
      <MainChat :activeChat="ActiveChat" v-else />
    </div>
</template>
  
<script setup>
    import ChatsList from '@/components/ChatsList.vue'
    import MainChat from '@/components/MainChat.vue'
    import NoChat from '@/components/NoChat.vue'
    import { ref } from 'vue'

    // ActiveChat is of the form : {receiver : info}

    const ActiveChat = ref(null)
</script>

<style scoped>
.chat-app-wrapper {
  display: flex;
  height: 100vh; /* Full viewport height */
  background-color: #020a1a; /* dark navy background like your mockup */
  color: white;
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
  background-color: #0b132b;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
</style>
