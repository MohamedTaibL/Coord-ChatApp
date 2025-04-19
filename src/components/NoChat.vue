<template>
  <div class="no-chat">
    <div class="message">
      <h2>No Conversation Selected</h2>
      <p>Select a chat from the left to start messaging</p>
    </div>
  </div>
</template>

<script setup>
// No logic needed for now
</script>

<style scoped>
.no-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0b132b;
  color: #ffffffaa;
  text-align: center;
  padding: 2rem;
}

.message h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #ffffff;
}

.message p {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #ccc;
}
</style>
