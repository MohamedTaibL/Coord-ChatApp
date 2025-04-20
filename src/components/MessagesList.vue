<template>
  <div class="messages-list">
    <Lister
      :filter="filter"
      :isGroup="false"
      :isCommunity="false"
    />
  </div>
</template>

<script setup>
import Lister from "./Lister.vue";
defineProps(["filter"]);
</script>

<style scoped>
  .messages-list{
    display: flex;
    flex-direction: column;
  }
</style>
