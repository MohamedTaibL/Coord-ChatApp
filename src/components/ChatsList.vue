<template>
    <div class="chats-list-main" v-if="!newChat">
        <div class="chats-list-header">
            <div class="main-header">
                {{ userName }}
            </div>
            <div class="chats-settings">
                <div class="new-chat-icon" @click="newChat = true">
                    <i class="fas fa-plus"></i>
                </div>
                <div class="filter-chat-icon" @click="activeFilter = !activeFilter">
                    <i class="fas fa-bars"></i>      
                </div>                    
            </div>
        </div>


        <div class="chats-list-body">
            <div class="search-bar">
                <input type="text" placeholder="Search..." v-model="filter" @click="activePrivateMessage = true; activeGroups = true; activeMessageSearch = true">
            </div>
            <div class="chats-list-body-content">
                <div class="private-chats">
                    <div @click="activePrivateMessage = !activePrivateMessage">
                        <label>private chats</label>
                        <span>{{ activePrivateMessage ? '▾' : '▸' }}</span>
                    </div>
                    <transition name="fade">
                        <MessagesList :filter="filterObject" :update="update" v-if="activePrivateMessage" @choice="Show({PrivateMessage : $emit})"/>
                    </transition>
                </div>
                <div class="groups">
                    <div @click="activeGroups = !activeGroups">
                        <label>groups</label>
                        <span>{{ activeGroups ? '▾' : '▸' }}</span>
                    </div>
                    <transition name="fade">
                        <GroupsList :filter="filterObject" :update="update" v-if="activeGroups" @choice="Show({Group : $emit})"/>
                    </transition>
                </div>
                <!-- this component should be off when it has no content -->
                <div class="messages" v-if="!filters && filter">
                    <div @click="activeMessageSearch = !activeMessageSearch">
                        <label>messages</label>
                        <span>{{ activeMessageSearch ? '▾' : '▸' }}</span>
                    </div>
                    <transition name="fade">
                        <MessageSearch :filter="filter" v-if="activeMessageSearch" @choice="Show({Message : $emit})"/>
                    </transition>
                </div>
            </div>
        </div>
    </div>
    
    <!-- in case we are searching using the newChats component -->
    <div class="chats-list-new-chat" v-else>
        <div class="chats-list-header">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div class="go-back-button" @click="newChat = false">
                    <i class="fas fa-arrow-left"></i>
                </div>
                <span class="main-header">New Chat</span>
            </div>  
        </div>

        <div class="chats-list-body">
            <div class="search-bar">
                <input type="text" placeholder="Search..." v-model="filter">
            </div>
            <SearchUsers :filter="filter"/>
        </div>
    </div>
    <div class="chats-filter" v-if="activeFilter">
        <ChatsFilter @filter="UpdateFilter"/>
    </div>

</template>

<script setup>
    import MessagesList from '@/components/MessagesList.vue'
    import GroupsList from '@/components/GroupsList.vue'
    import MessageSearch from  '@/components/MessageSearch.vue'
    import SearchUsers from '@/components/SearchUsers.vue'
    import ChatsFilter from '@/components/ChatsFilter.vue'

    import { auth , db } from '@/Firebase/config.js'
    import { ref, onMounted, computed, defineEmits } from 'vue'

    const emit = defineEmits(['choice'])

    const userName = ref('UserName')
    const filter = ref('')
    const filters = ref('') // it takes only one value according to the chossen value
    const activePrivateMessage = ref(true)  
    const activeGroups = ref(true)
    const activeMessageSearch = ref(false)
    const newChat = ref(false)
    const activeFilter = ref(false)
    const update = ref(null)
    const filterObject = computed(() => {
        return {
            search: filter.value,
            filters: filters.value
        }
    })

    const UpdateFilter = (filter) => {
        filters.value = filter
        // update the active chat
        emit('choice', {
            chat: 'Chat',
            chatId: 'ChatId'
        })
    }

    const Show = (choice) => {
        emit('active', choice)
    }

    onMounted(() => {
        const user = auth.currentUser
        const userNameRef = db.collection('users').doc(user.uid)
        userNameRef.get().then((doc) => {
            userName.value = doc.data().name
        })

    })

</script>


<style scoped>
/* Main container */
.chats-list-main,
.chats-list-new-chat {
  background-color: #030b1d;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 1rem;
  position: relative;
}

/* Header */
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

/* Icons */
.chats-settings {
  display: flex;
  gap: 1rem;
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
    font-family: 'Roboto', sans-serif;
}

.search-bar input:focus {
    border: 1px solid #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

/* Chat sections */
.chats-list-body-content {
  padding: 0 1rem;
  flex-grow: 1;
  overflow-y: auto;
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
