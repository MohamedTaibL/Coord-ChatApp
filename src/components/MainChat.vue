<template>
    <div class="main-chat">
        <ChatBar @search="search" />
        <ChatLive :search="search"/>
    </div>  
</template>

<script setup>
import ChatBar from './ChatBar.vue';
import ChatLive from './ChatLive.vue';
import { ref } from 'vue';

const search = ref('');
</script>

<style scoped>
.main-chat {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: #DCF0F9;
}
</style>