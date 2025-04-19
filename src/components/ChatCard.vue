<template>
    <img :src="chat.profilePicture" class="avatar" />
    <div class="chat-details">
      <div>
        <strong>{{ chat.name || "Unnamed Chat" }}</strong>
        
      </div>
      <p>{{ chat.lastMessage || "No messages yet." }}</p>
    </div>
</template>
<script setup>
import { ref, defineProps} from "vue";

const props = defineProps({
    chat: Object,
});
</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
}
.chat-details {
  display: flex;
  flex-direction: column;
}
</style>