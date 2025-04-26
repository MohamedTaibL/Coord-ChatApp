<template>
  <div class="chat-bar">
    <div class="user-info" @click="Redirect">
      <img
        :src="chat ? (chat.picture ? chat.picture : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y') : defaultAvatar"
        class="avatar" />
      <div class="user-meta">
        <strong style="display:flex; justify-content: flex-start;">{{ chat ? chat.name : 'user1' }}</strong>
        <small style="display:flex; justify-content: flex-start;">
          {{ chat && chat.bio ? (chat.bio.length > 50 ? chat.bio.slice(0, 50) + '...' : chat.bio) : 'username' }}
        </small>
      </div>
    </div>
    <input class="chat-search" type="text" v-model="searchQuery" placeholder="search the chat ..." />
    <div style="display: flex; flex-direction: row; gap: 0.5rem">
      <div class="join-button" v-if="!Permitted" @click="joinCommunity">Join to get notifications!</div>
      <div class="menu-wrapper" @mouseleave="startCloseTimer" @mouseenter="clearCloseTimer">
        <div class="filter-chat-icon" @click="toggleMenu">
          <i class="fa fa-ellipsis-v menu-icon"></i>
        </div>
        <div class="popup" :class="{ 'popup-active': showMenu }" v-if="showMenu">
          <div class="menu-content">
            <!-- Edit Details as an options icon -->
            <div class="menu-option" @click="$router.push({name :'editdetails' , params: {id : props.chat.id}})" v-if="isAdmin">
              <i class="fa-solid fa-pen-to-square"></i>
              <span>Edit Details</span>
            </div>
            <div class="menu-option" @click="leave" v-if="(chat.isCommunity || chat.isGroup) && Permitted">
              <i class="fa-solid fa-door-open"></i>
              <span>Leave</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { db, auth } from '@/Firebase/config';
import firebase from 'firebase/app';
import { useRouter } from 'vue-router';
const props = defineProps({
  chat: Object,
  isPermited: Boolean
});

const emit = defineEmits(['search']);

const showMenu = ref(false);
const searchQuery = ref('');
const Permitted = ref(true)
const isAdmin = computed(() => {
  return props.chat.admins.includes(auth.currentUser.uid);
});
let closeTimeout = null;

const router = useRouter()

function toggleMenu() {
  showMenu.value = !showMenu.value;
  if (!showMenu.value) clearCloseTimer();
}

function startCloseTimer() {
  clearCloseTimer();
  closeTimeout = setTimeout(() => {
    showMenu.value = false;
  }, 300);
}

function clearCloseTimer() {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }
}

function joinCommunity() {
  if (props.chat.isCommunity) {
    db.collection('chats').doc(props.chat.id).update({
      participants: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid)
    })
  }
  // take off the button before the update,
  Permitted.value = true
}

function leave() {
  // if the user is not the number of admins left is 1 and it's the current user, tell him he can't leave
  if (props.chat.admins.length === 1 && props.chat.admins[0] === auth.currentUser.uid) {
    alert(`You are the last admin, you can\'t leave, you can delete the ${props.chat.isCommunity ? 'community' : 'group'} instead, or add another admin`);
    return;
  }

  // signal the user to check if he wants to leave
  if (!confirm(`Are you sure you want to leave ${props.chat.name}?`)) {
    return;
  }

  db.collection('chats').doc(props.chat.id).update({
    participants: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.uid)
  })

  Permitted.value = false;
}

const Redirect = () => {
  if (props.chat.id === null) {
    return;
  }
  else if (!props.chat.isCommunity && !props.chat.isGroup) {
    const otherUserID = props.chat.participants.find((uid) => (uid !== auth.currentUser.uid));
    router.push({ name: 'viewprofile', params: { id: otherUserID} });
  }
  else{
    router.push({ name: 'detailsview', params: { id: props.chat.id } });

  }
}

// Watch searchQuery and emit when it changes
watch(searchQuery, (newValue) => {
  emit('search', newValue);
});

onMounted(() => {
  Permitted.value = props.isPermited
})


</script>

<style scoped>
.chat-bar {
  display: flex;
  align-items: center;
  background-color: #081e5e;
  border-left: 1px solid #1c2636;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  position: sticky;
  z-index: 1;
  /* Ensure chat bar stays above other elements */
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

.menu-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.menu-icon {
  font-size: 1.25rem;
  color: #ccc;
  margin-left: 1rem;
  cursor: pointer;
}

.popup {
  right: 10%;
  top: 100%;
  position: absolute;
  background-color: #0d1a33;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 10;
  /* Default z-index */
  padding: 0.5rem;
  transition: z-index 0.2s ease;
}

.popup-active {
  z-index: 9999;
  /* Higher z-index when active */
}

.menu-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.menu-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  cursor: pointer;
  border-radius: 0.5rem;
  color: #ddd;
  transition: background-color 0.2s ease;
}

.menu-option:hover {
  background-color: #1d2a4a;
}

.join-button {
  background-color: #1d02ce;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.join-button:hover {
  background-color: #0a0196;
}

.user-info {
  display: flex;
  align-items: center;
  margin-right: 1rem;
  position: relative;
  cursor: pointer;
  /* Ensure status dot is positioned relative to this container */
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

/* Status Dot for online/offline */
.status-dot {
  width: 10px;
  height: 10px;
  background-color: #f44336;
  /* Default offline color */
  border-radius: 50%;
  position: absolute;
  top: 0;
  /* Position the dot on the top of the avatar */
  left: -3%;
  /* Position it on the right side of the avatar */
  transform: translateX(50%);
  /* Fine-tune the position */
  transition: background-color 0.3s ease;
}

.status-dot.online {
  background-color: #4caf50;
  /* Green for online */
}
</style>
