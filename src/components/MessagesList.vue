<template>
  <div class="messages-list">
    <CurrentConvo v-if="$router.currentRoute.value.name == 'new'" :filter="filter.search ? filter.search : null" />
    <Lister
      :filter="filter"
      :isGroup="false"
      :isCommunity="false"
    />
  </div>
</template>

<script setup>
import Lister from "./Lister.vue";
import CurrentConvo from "./CurrentConvo.vue";  
defineProps(["filter"]);
defineEmits(["choice"]);
</script>

<style scoped>
  .messages-list{
    display: flex;
    flex-direction: column;
  }
</style>
