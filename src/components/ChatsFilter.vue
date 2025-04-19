<template>
  <div class="filter-list popup">
    <h4>Filter chats by</h4>
    <div class="filter-option" @click="$emit('filter', 'unread')">
      <i class="fas fa-envelope"></i>
      <span>Unread</span>
    </div>
    <div class="filter-option" @click="$emit('filter', 'mentions')">
      <i class="fas fa-at"></i>
      <span>Mentions</span>
    </div>
    <div class="filter-option" @click="$emit('filter', 'admin')">
      <i class="fas fa-user-shield"></i>
      <span>Administered Groups</span>
    </div>
    <div class="filter-option" @click="$emit('filter', 'favorites')">
      <i class="fas fa-star"></i>
      <span>Favorites</span>
    </div>
  </div>
</template>

<script setup>
defineEmits(["filter"]);
</script>

<style scoped>
.filter-list {
  padding: 1rem;
  background-color: #0d1a33;
  border-radius: 0.75rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.filter-list h4 {
  margin-bottom: 1rem;
  color: #bbb;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  cursor: pointer;
  border-radius: 0.5rem;
  color: #ddd;
  transition: background-color 0.2s ease;
}

.filter-option:hover {
  background-color: #132d55;
}

.filter-option i {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.popup {
  position: absolute;
  top: 60px; /* adjust based on where your filter icon is */
  left: 120px;
  background-color: #0d1a33;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  z-index: 2000;
  width: 220px;
}
</style>
