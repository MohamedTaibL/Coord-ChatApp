<!-- src/components/Lister.vue -->
<template>
  <div
    class="chat-card"
    v-for="chat in filteredChats"
    :key="chat.id"
    @click="$emit('choice', chat)"
  >
    <ChatCard :chat="chat" />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { db, auth } from "@/Firebase/config";

const props = defineProps({
  filter: Object,
  update: [Number, String, Object], // any trigger value
  isGroup: Boolean,
  isCommunity: Boolean,
});

const chats = ref([]);

const fetchChats = async () => {
  const query = db
    .collection("chats")
    .where("isGroup", "==", props.isGroup)
    .where("isCommunity", "==", props.isCommunity);

  const snapshot = await query.get();
  const user = auth.currentUser;

  chats.value = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((chat) => chat.participants?.includes(user.uid));
};

watch(() => props.update, fetchChats, { immediate: true });

const filteredChats = computed(() => {
  let list = chats.value

  // search filter
  if (props.filter?.search) {
    list = list.filter(c => c.name?.toLowerCase().includes(props.filter.search.toLowerCase()))
  }

  // filter type logic
  switch (props.filter?.filters) {
    case 'unread':
      list = list.filter(c => c.unreadCount > 0)
      break
    case 'mentions':
      list = list.filter(c => c.mentions?.includes(auth.currentUser.uid))
      break
    case 'admin':
      list = list.filter(c => c.admins?.includes(auth.currentUser.uid))
      break
    case 'favorites':
      list = list.filter(c => c.favorites?.includes(auth.currentUser.uid))
      break
  }

  return list
})


</script>

<style scoped>
.chat-card {
  background-color: #0d1a33;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.chat-card:hover {
  background-color: #132d55;
}
</style>
