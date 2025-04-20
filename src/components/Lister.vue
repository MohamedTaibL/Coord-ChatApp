<template>
  <div class="lister">
    <CurrentConvo v-if="$router.currentRoute.value.name == 'new' && !isGroup && !isCommunity" :filter="filter.search ? filter.search : null" />
    <div v-if="filteredChats.length === 0">
      <p>No chats available</p>
    </div>
    <div
      class="invites-card"
      v-for="chat in filteredInvites"
      :key="chat.id"
    >
      <ChatCard :chat="chat" :isGroup="isGroup" :isCommunity="isCommunity" :isInvite="true"/>
    </div>
    <div
      class="chat-card"
      v-for="chat in filteredChats"
      :key="chat.id"
    >
      <ChatCard :chat="chat" :isGroup="isGroup" :isCommunity="isCommunity" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { db, auth } from "@/Firebase/config";
import ChatCard from "@/components/ChatCard.vue";
import CurrentConvo from "@/components/CurrentConvo.vue";

const props = defineProps({
  filter: Object,
  isGroup: Boolean,
  isCommunity: Boolean,
});

const chats = ref([]);
const filteredChats = ref([]);
const filteredInvites = ref([]);
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
    .where("isGroup", "==", props.isGroup)
    .where("isCommunity", "==", props.isCommunity);

  const snapshot = await query.get();
  const user = auth.currentUser;


  chats.value = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((chat) => chat.participants?.includes(user.uid));

  applyFilter();
};

const applyFilter = async () => {
  const user = auth.currentUser;
  let list = [...chats.value];
  // get the invites list from the 'users' where id = user.uid .invites
  const userInfo = await db.collection("users").doc(user.uid).get();
  const invites = userInfo.data().invitations || [];

  const inviteChats = await Promise.all(invites.map(async (inviteId) => {
    const doc = await db.collection("chats").doc(inviteId).get();
    if (!doc.exists) return null;

    const data = doc.data();
    if ((data.isGroup && props.isGroup) || (data.isCommunity && props.isCommunity)) {
      return { id: doc.id, ...data };
    }
    return null;
  }));

  let inviteslist = inviteChats.filter(Boolean);

  if (props.filter?.search) {
    const search = props.filter.search.toLowerCase();

    list = list.filter(c => {
      const nameMatches = c.name?.toLowerCase().includes(search);

      const participantMatches = c.participants
        .filter(id => id !== user.uid)
        .some(id => {
          const participant = usersMap.value[id];
          const participantName = participant?.name?.toLowerCase();
          return participantName?.includes(search);
        });

      return nameMatches || participantMatches;
    });
  
    inviteslist = inviteslist.filter(c => {
      const nameMatches = c.name?.toLowerCase().includes(search);

      const participantMatches = c.participants
        .filter(id => id !== user.uid)
        .some(id => {
          const participant = usersMap.value[id];
          const participantName = participant?.name?.toLowerCase();
          return participantName?.includes(search);
        });

      return nameMatches || participantMatches;
    });
  }

  switch (props.filter?.filters) {
    case 'unread':
      list = await Promise.all(list.map(async (chat) => {
        const snapshot = await db.collection('notifications')
          .where('user-id', '==', user.uid)
          .where('source-id', '==', chat.id)
          .where('is-read', '==', false)
          .get();
        return snapshot.empty ? null : chat;
      }));
      list = list.filter(Boolean);
      inviteslist = [];
      break;

    case 'mentions':
      list = await Promise.all(list.map(async (chat) => {
        const snapshot = await db.collection('notifications')
          .where('user-id', '==', user.uid)
          .where('source-id', '==', chat.id)
          .where('type', '==', 'mention')
          .get();
        return snapshot.empty ? null : chat;
      }));
      list = list.filter(Boolean);
      inviteslist = [];
      break;

    case 'admin':
      list = list.filter(chat => chat.admins?.includes(user.uid));
      inviteslist = [];
      break;

    case 'favorites':
      const userDoc = await db.collection('users').doc(user.uid).get();
      const favorites = userDoc.data().favorites || [];
      list = list.filter(chat => favorites.includes(chat.id));
      inviteslist = inviteslist.filter(chat => favorites.includes(chat.uid))
      break;
  }

  filteredInvites.value = inviteslist;
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