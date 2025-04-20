<template>
    <div class="lister">
      <div
        class="chat-card"
        v-for="chat in filteredChats"
        :key="chat.id"
      >
        <CommunityCard :community="chat"/>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from "vue";
  import { db, auth } from "@/Firebase/config";
  import CommunityCard from "@/components/CommunityCard.vue";
  
  const props = defineProps({
    filter: Object,
  });
  
  const chats = ref([]);
  const filteredChats = ref([]);
  const usersMap = ref({});
  
  const fetchUsers = async () => {
    const snapshot = await db.collection("users").get();
    const map = {};
    snapshot.forEach(doc => {
      map[doc.id] = doc.data();
    });
    usersMap.value = map;
  };
  
  const fetchChats = async () => {
    const query = db
      .collection("chats")
      .where("isCommunity", "==", true);
  
    const snapshot = await query.get();
    const user = auth.currentUser;
  
  
    chats.value = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }));  
    applyFilter();
  };
  
  const applyFilter = async () => {
    let list = [...chats.value];
  
    if (props.filter) {
      const search = props.filter.toLowerCase();
  
      list = list.filter(c => {
        const nameMatches = c.name?.toLowerCase().includes(search);  
        return nameMatches;
      });
    }
  
    filteredChats.value = list;
  };
  
  watch(() => props.filter, applyFilter, { deep: true });
  
  onMounted(async () => {
    await fetchUsers();
    await fetchChats();
  });
  </script>
  
  <style scoped>
  .lister {
    color: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 1rem;
    z-index: 1000;
    overflow: visible !important;
  }
  </style>