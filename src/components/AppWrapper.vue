<template>
  <div class="chat-app-wrapper">
    <ChatsList v-if="showSidebar" class="chatslist"/>
    <button class="toggle-btn" @click="showSidebar = false" v-if="showSidebar">✖</button>
    <button v-else class="reopen-btn" @click="showSidebar = true">❯</button>
    <NoChat v-if="noChat" />
    <MainChat v-else />
  </div>
</template>


<script setup>
import ChatsList from '@/components/ChatsList.vue'
import MainChat from '@/components/MainChat.vue'
import NoChat from '@/components/NoChat.vue'
import { ref, watch , onMounted} from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const noChat = ref(true)
const showSidebar = ref(true)

watch(() => route.params.id, (id) => {
  noChat.value = !id
})
onMounted(()=>
{
    noChat.value = !route.params.id
})
</script>

<style scoped>
.chat-app-wrapper {
  display: flex;
  height: 100vh; /* Full viewport height */
  overflow: hidden;
}

/* ChatsList (sidebar) */
.chat-app-wrapper > *.chatslist {
  max-width: 320px; /* or whatever matches your design */
  border-right: 1px solid #1c2636;
  display: flex;
  flex-direction: column;
}

/* MainChat (right panel) */
.chat-app-wrapper > *:last-child {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* ----------------------------------------------------- */
.toggle-btn {
  width: 20px;
  background: #1c2636;
  color: white;
  border: none;
  font-size: 15px;
  cursor: pointer;
}

.reopen-btn {
  width: 20px;
  background: #1c2636;
  color: white;
  border: none;
  font-size: 15px;
  cursor: pointer;
}

</style>
