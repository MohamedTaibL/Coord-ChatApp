<template>
    <div class="chat-bar">
      <div class="user-info">
        <img :src="profileImage || defaultAvatar" class="avatar" />
        <div class="status-dot" :class="{ online: isOnline }"></div>
        <div class="user-meta">
          <strong>{{ userName || 'user1' }}</strong>
          <small>@{{ username || 'username' }}</small>
        </div>
      </div>
      <input class="chat-search" type="text" v-model="searchQuery" placeholder="search the chat ..." />
      <i class="fa fa-ellipsis-v menu-icon"></i>
    </div>
  </template>
  
<script setup>
    import { ref, onMounted } from 'vue';
    import { db} from '@/Firebase/config';
    import { useRoute } from 'vue-router';

    const route = useRoute();

    const userName = ref('');
    const username = ref('');
    const profileImage = ref(null);
    const searchQuery = ref('');
    
    const defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp';
    
    const isOnline = ref(false);

    async function listenToUserStatus() {
    const otherUserId = props.chat?.participants?.find(uid => uid !== auth.currentUser.uid);
    if (!otherUserId) return;

    const userRef = db.collection('users').doc(otherUserId);
    userRef.onSnapshot(doc => {
        if (doc.exists) {
        isOnline.value = doc.data().state === 'online';
        }
    });
    }


  onMounted(async () => {
    const chatid = route.params.id;
    let uid = route.params.id;
    if(route.name != 'new'){
        // get the chat from the database
        const chatDoc = await db.collection('chats').doc(chatid).get();
        if (chat.exists) {
            // not going t push
        }
    } 
    const doc = await db.collection('users').doc(uid).get();
    if (doc.exists) {
      const data = doc.data();
      userName.value = data.name;
      username.value = data.username;
      profileImage.value = data.imageURL || null;
    }
  });
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
  background-color: #0d1a33;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
}

.chat-search {
  background-color: #13254a;
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
  