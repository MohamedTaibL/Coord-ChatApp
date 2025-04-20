<template>
  <div class="ChatsListComp" v-if="route.name != 'community'">
    <div class="chats-list-main" v-if="!newChat">
      <div class="chats-list-header">
        <div class="main-header">{{ userName }}</div>
        <div class="chats-settings">
          <div class="new-chat-icon" @click="newChat = true">
            <i class="fas fa-plus"></i>
          </div>
          <div
            class="filter-wrapper"
            @mouseleave="startCloseTimer"
            @mouseenter="clearCloseTimer"
          >
            <div class="filter-chat-icon" @click="toggleFilter">
              <i class="fas fa-bars"></i>
            </div>
            <ChatsFilter
              v-if="showFilterPopup"
              :active="filters"
              @filter="updateFilter"
            />
          </div>
        </div>
      </div>

      <div class="chats-list-body">
        <div class="search-bar">
          <input
            type="text"
            placeholder="Search..."
            v-model="filter"
            @click="
              activePrivateMessage = true;
              activeGroups = true;
            "
          />
        </div>
        <div class="chats-list-body-content">
          <div class="current-filter">
            {{ filters }}
          </div>
          <div class="private-chats">
            <div @click="activePrivateMessage = !activePrivateMessage">
              <label>private chats</label>
              <span>{{ activePrivateMessage ? "▾" : "▸" }}</span>
            </div>
            <transition name="fade">
              <MessagesList
                :filter="filterObject"
                v-if="activePrivateMessage"
              />
            </transition>
          </div>
          <div class="groups">
            <div @click="activeGroups = !activeGroups">
              <label>groups</label>
              <span>{{ activeGroups ? "▾" : "▸" }}</span>
            </div>
            <transition name="fade">
              <GroupsList :filter="filterObject" v-if="activeGroups" />
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- in case we are searching using the newChats component -->
    <div class="chats-list-new-chat" v-else>
      <div class="chats-list-header">
        <div style="display: flex; align-items: center; gap: 1rem">
          <div class="go-back-button" @click="newChat = false">
            <i class="fas fa-arrow-left"></i>
          </div>
          <span class="main-header">New Chat</span>
        </div>
      </div>

      <div class="chats-list-body">
        <div class="search-bar">
          <input type="text" placeholder="Search..." v-model="filter" />
        </div>
        <SearchUsers :filter="filter" />
      </div>
    </div>
  </div>



  <!-------------------------- Communities ---------------------------->

  <div class="ChatsLiveCompCommun" v-else>
    <div class="chats-list-main" v-if="!newChat">
      <div class="chats-list-header">
        <div class="main-header">{{ userName }}</div>
        <div class="chats-settings">
          <div class="new-chat-icon" @click="newChat = true">
            <i class="fas fa-search"></i>
          </div>
        </div>
        <div
          class="filter-wrapper"
          @mouseleave="startCloseTimer"
          @mouseenter="clearCloseTimer"
        >
          <div class="filter-chat-icon" @click="toggleFilter">
            <i class="fas fa-bars"></i>
          </div>
          <ChatsFilter
            v-if="showFilterPopup"
            :active="filters"
            @filter="updateFilter"
          />
        </div>
      </div>

      <div class="chats-list-body">
        <div class="search-bar">
          <input type="text" placeholder="Search..." v-model="filter" />
        </div>
        <div class="chats-list-body-content">
          <div class="communities">
            <transition name="fade">
              <CommunitiesList :filter="filterObject" v-if="activeGroups" />
            </transition>
          </div>
        </div>
      </div>
    </div>
    <!-- in case we are searching using the newChats component -->
    <div class="chats-list-new-chat" v-else>
      <div class="chats-list-header">
        <div style="display: flex; align-items: center; gap: 1rem">
          <div class="go-back-button" @click="newChat = false">
            <i class="fas fa-arrow-left"></i>
          </div>
          <span class="main-header">Explore Communities</span>
        </div>
      </div>

      <div class="chats-list-body">
        <div class="search-bar">
          <input type="text" placeholder="Search..." v-model="filter" />
        </div>
        <div class="chats-list-body-content">
          <div class="communities">
            <transition name="fade">
              <SearchCommunities :filter="filter" />
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import MessagesList from "@/components/MessagesList.vue";
import GroupsList from "@/components/GroupsList.vue";
import CommunitiesList from "@/components/CommunitiesList.vue";
import SearchCommunities from "@/components/SearchCommunities.vue";
import SearchUsers from "@/components/SearchUsers.vue";
import ChatsFilter from "@/components/ChatsFilter.vue";
import { auth, db } from "@/Firebase/config.js";

const route = useRoute();

const activeCommunities = ref(true); // toggle for dropdown
const newChat = ref(false);
const showFilterPopup = ref(false);
const filters = ref("");
const userName = ref("UserName");
const filter = ref("");
const activePrivateMessage = ref(true);
const activeGroups = ref(true);
let closeTimeout = null;

const filterObject = computed(() => ({
  search: filter.value,
  filters: filters.value,
}));

function toggleFilter() {
  showFilterPopup.value = !showFilterPopup.value;
  if (!showFilterPopup.value) clearCloseTimer();
}

function updateFilter(filterType) {
  filters.value = filterType;
  clearCloseTimer();
  showFilterPopup.value = false;
}

function startCloseTimer() {
  clearCloseTimer();
  closeTimeout = setTimeout(() => {
    showFilterPopup.value = false;
  }, 300);
}

function clearCloseTimer() {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }
}

onMounted(() => {
  const user = auth.currentUser;
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((doc) => {
      userName.value = doc.data().name;
    });
});
</script>

<style scoped>
.ChatsListComp {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
}

.ChatsLiveCompCommun {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
}

.chats-list-main,
.chats-list-new-chat {
  background-color: #081e5e;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 1rem;
  z-index: 1000;
  overflow: visible !important;
}

.chats-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #1a1a1a;
}

.main-header {
  font-weight: bold;
  font-size: 1.25rem;
}

.chats-settings {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-wrapper {
  position: relative;
  display: inline-block;
}

.new-chat-icon,
.filter-chat-icon,
.go-back-button {
  cursor: pointer;
  font-size: 1.2rem;
}

/* Search bar */
.search-bar {
  padding: 0.75rem 1rem;
}

.search-bar input {
  width: calc(100% - 1rem);
  padding: 0.5rem;
  border-radius: 8px;
  border: none;
  outline: none;
  background-color: #0d1a33;
  color: white;
}

.search-bar input::placeholder {
  color: #888;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: "Roboto", sans-serif;
}

.search-bar input:focus {
  border: 1px solid #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

/* Chat sections */
.chats-list-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.chats-list-body-content {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden; /* ensures no x-scrolling */
  scroll-behavior: smooth;
  padding: 0 1rem;
}

.chats-list-body-content::-webkit-scrollbar {
  width: 8px;
}

.chats-list-body-content::-webkit-scrollbar-thumb {
  background-color: #4d94ff;
  border-radius: 10px;
}

.chats-list-body-content::-webkit-scrollbar-track {
  background: transparent;
}


.private-chats,
.groups,
.messages {
  margin-bottom: 1rem;
}

.private-chats > div,
.groups > div,
.messages > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0;
  font-weight: bold;
}

/* Arrow rotation */
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

/* Transition effect */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ChatCard (for New Chat users) */
.SearchUsers {
  padding: 0 1rem;
}

.ChatCard {
  background-color: #0d1a33;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.ChatCard:hover {
  background-color: #132d55;
}
</style>
