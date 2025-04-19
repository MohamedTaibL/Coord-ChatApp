<template>
  <Lister
    :filter="filter"
    :update="update"
    :isGroup="true"
    :isCommunity="false"
    @choice="$emit('choice', $event)"
  />
</template>

<script setup>
import Lister from "./Lister.vue";
defineProps(["filter", "update"]);
defineEmits(["choice"]);
</script>
