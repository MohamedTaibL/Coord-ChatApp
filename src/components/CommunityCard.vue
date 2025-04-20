<template>
    <div class="community-card" :class="{ active: isActive }" @click="redirectToCommunity">
      <img :src="community.picture || defaultImage" class="avatar" />
      <div class="status-dot" :class="{ online: isOnline }"></div>
      <div class="community-details">
        <strong>{{ community.name || 'Unnamed Community' }}</strong>
        <p>{{ lastMessage || 'No messages yet.' }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { auth, db } from '@/Firebase/config';
  import { defineProps } from 'vue';
  
  const props = defineProps({
    community: Object
  });
  
  const router = useRouter();
  const isActive = ref(false);
  const isOnline = ref(false);
  const lastMessage = ref('');
  
  const defaultImage = 'https://i.ibb.co/W4xnwhjx/communityavatar.png';
  
  function checkActive() {
    const route = router.currentRoute.value;
    isActive.value = route.name === 'community' && route.params.id === props.community.id;
  }
  
  async function fetchLastMessage() {
    if (!props.community.id) return;
  
    const messageSnapshot = await db
      .collection('messages')
      .where('chatId', '==', props.community.id)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();
  
    if (!messageSnapshot.empty) {
      lastMessage.value = messageSnapshot.docs[0].data().text || 'No content';
    }
  }
  
  function listenToStatus() {
    const ref = db.collection('users').doc(auth.currentUser.uid);
    ref.onSnapshot(doc => {
      if (doc.exists) {
        isOnline.value = doc.data().state === 'online';
      }
    });
  }
  
  function redirectToCommunity() {
    if (props.community.id) {
      router.push({ name: 'community', params: { id: props.community.id } });
    }
  }
  
  onMounted(() => {
    checkActive();
    fetchLastMessage();
    listenToStatus();
  });
  
  watch(() => router.currentRoute.value, checkActive);
  </script>
  
  <style scoped>
  .community-card {
    background-color: #0d1a33;
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.25s ease, transform 0.15s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: relative;
  }
  
  .community-card:hover {
    background-color: #1a2b47;
    transform: translateY(-1px);
  }
  
  .community-card.active {
    background-color: #264d73;
    box-shadow: 0 0 0 2px #4d94ff;
  }
  
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 1rem;
    object-fit: cover;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  }
  
  .community-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }
  
  .community-details strong {
    font-size: 1rem;
    color: #ffffff;
  }
  
  .community-details p {
    margin: 0;
    font-size: 0.875rem;
    color: #cccccc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .status-dot {
    width: 10px;
    height: 10px;
    background-color: #f44336;
    border-radius: 50%;
    position: absolute;
    top: 24%;
    left: 7.5%;
    transform: translateX(-50%);
    transition: background-color 0.3s ease;
  }
  
  .status-dot.online {
    background-color: #4caf50;
  }
  </style>
  