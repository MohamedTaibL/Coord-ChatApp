<template>
  <div class="filter-list popup">
    <h4>Filter chats by</h4>
    <div
      class="filter-option"
      :class="{ active: active === 'unread' }"
      @click="handleFilterClick('unread')"
    >
      <i class="fas fa-envelope"></i>
      <span>Unread</span>
    </div>
    <div
      class="filter-option"
      :class="{ active: active === 'mentions' }"
      @click="handleFilterClick('mentions')"
    >
      <i class="fas fa-at"></i>
      <span>Mentions</span>
    </div>
    <div
      class="filter-option"
      :class="{ active: active === 'admin' }"
      @click="handleFilterClick('admin')"
    >
      <i class="fas fa-user-shield"></i>
      <span>Administered Groups</span>
    </div>
    <div
      class="filter-option"
      :class="{ active: active === 'favorites' }"
      @click="handleFilterClick('favorites')"
    >
      <i class="fas fa-star"></i>
      <span>Favorites</span>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits(['filter']);
const { active } = defineProps({ active: String });

// Function to handle filter clicks
const handleFilterClick = (filterType) => {
  // If the clicked filter is already active, reset the filter (emit an empty string)
  if (active === filterType) {
    emit('filter', ''); // Reset the filter
  } else {
    emit('filter', filterType); // Set the new filter
  }
};
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

.filter-option.active {
  background-color: #1d3d66;
  font-weight: bold;
  color: #fff;
}

.filter-option i {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.popup {
  position: absolute;
  background-color: #0d1a33;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  z-index: 2000;
  width: 220px;
}
</style>
