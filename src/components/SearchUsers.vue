<template>
  <div
    class="ChatCard"
    v-for="user in filteredUsers"
    :key="user.id"
    @click="$emit('choice', user)"
  >
    <img :src="user.imgURL || 'https://www.gravatar.com/avatar/?d=mp' " class="avatar" />
    <div class="details">
      <div class="text-info">
        <strong>{{ user.name || user.username}}</strong>
        <p>@{{ user.username }}</p>
      </div>
      <div style="align-items: flex-end;">
        <p>{{ user.bio || 'no bio :('}}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed , onMounted} from "vue";
import { db } from "@/Firebase/config";

const props = defineProps(["filter"]);
const users = ref([]);

const fetchUsers = async () => {
  const snapshot = await db.collection("users").get(); 
  users.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

onMounted(fetchUsers);

const filteredUsers = computed(() => {
  return users.value.filter(
    (u) =>
      (u.name && u.name.toLowerCase().includes(props.filter.toLowerCase())) ||
      (u.username && u.username.toLowerCase().includes(props.filter.startsWith("@") ? props.filter.toLowerCase().slice(1) : props.filter.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(props.filter.toLowerCase()))
  );
});
</script>

<style scoped>
.ChatCard {
  display: flex;
  gap: 1rem;
  background-color: #0d1a33;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  margin: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: 1px solid transparent;
}

.ChatCard:hover {
  background-color: #132d55;
  border-color: #1e3a8a;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #1a1a1a;
}

.details {
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* Distribute space between left and right sections */
  width: 100%;
}

.text-info{
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 70%; /* Adjust based on the available space */
  overflow: hidden;
}

.text-info strong,
.text-info p {
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  max-width: 100%;

  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}


.details > div {
  display: flex;
  flex-direction: column;
}

.details p {
  margin: 0;
  font-size: 0.85rem;
  color: #a0a0a0;
  text-overflow: ellipsis;
}

</style>