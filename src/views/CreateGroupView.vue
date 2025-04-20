<template>
    <form class="form-container">
      <h2 class="form-title">Create New Private Group</h2>
      
      <div class="form-field">
        <label for="name">Name: (Not required) </label>
        <input type="text" id="name" v-model="formData.name" placeholder="Enter group name" required />
      </div>
  
      <div class="form-field">
        <label for="bio">Bio: (Not required) </label>
        <textarea id="bio" v-model="formData.bio" placeholder="Write a short description" required></textarea>
      </div>
  
      <div class="form-field user-selection">
        <label>Add Users</label>
        
        <!-- Search input and dropdown -->
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search users" 
            @input="filterUsers" 
          />
          
          <div class="dropdown" v-if="searchQuery && filteredUsers.length > 0">
            <div class="dropdown-content">
              <div 
                v-for="user in filteredUsers" 
                :key="user.username" 
                class="user-item" 
                @click="addUser(user)"
              >
                <img :src="user.imgURL || '/api/placeholder/40/40'" class="user-avatar" :alt="user.name" />
                <div class="user-info">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-username">@{{ user.username }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Selected users display -->
        <div class="selected-users-container">
          <h3>Selected Users</h3>
          <div class="selected-users">
            <div v-if="selectedUsers.length === 0" class="no-users">
              No users selected
            </div>
            <div v-else class="users-list">
              <div 
                v-for="user in selectedUsers" 
                :key="user.username" 
                class="selected-user-item"
              >
                <div class="user-display">
                  <img :src="user.imgURL || '/api/placeholder/40/40'" class="user-avatar" :alt="user.name" />
                  <div class="user-info">
                    <div class="user-name">{{ user.name }}</div>
                    <div class="user-username">@{{ user.username }}</div>
                  </div>
                </div>
                <button 
                  type="button" 
                  class="remove-btn" 
                  @click="removeUser(user)"
                  aria-label="Remove user"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button type="submit" class="submit-btn">Create Group</button>
    </form>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { db } from '@/Firebase/config';
  
  // Form data
  const formData = reactive({
    name: '',
    bio: '',
  });
  
  // Users management
  const users = ref([]);
  const selectedUsers = ref([]);
  const searchQuery = ref('');
  const filteredUsers = ref([]);
  
  // Fetch users from database
  onMounted(async () => {
    try {
      const query = await db.collection("users").get();
      query.forEach((doc) => {
        const userData = doc.data();
        users.value.push({
          id: doc.id,
          username: userData.username,
          name: userData.name,
          imgURL: userData.imgURL
        });
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  });
  
  // Filter users based on search query
  const filterUsers = () => {
    if (!searchQuery.value) {
      filteredUsers.value = [];
      return;
    }
    
    const query = searchQuery.value.toLowerCase();
    filteredUsers.value = users.value
      .filter(user => 
        !selectedUsers.value.some(selectedUser => selectedUser.id === user.id) &&
        (user.name.toLowerCase().includes(query) || 
         user.username.toLowerCase().includes(query))
      )
      .slice(0, 5); // Show maximum 5 results
  };
  
  // Add user to selected users
  const addUser = (user) => {
    selectedUsers.value.push(user);
    searchQuery.value = '';
    filteredUsers.value = [];
  };
  
  // Remove user from selected users
  const removeUser = (user) => {
    selectedUsers.value = selectedUsers.value.filter(selectedUser => 
      selectedUser.id !== user.id
    );
  };
  </script>
  
  <style scoped>
  .form-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2.5rem;
    background-color: #ffffff;
    border-radius: 1.25rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12), 
                0 4px 8px rgba(10, 36, 114, 0.08),
                0 0 1px rgba(10, 36, 114, 0.2);
  }
  
  .form-title {
    color: #0A2472;
    background: linear-gradient(135deg, #0A2472, #0E6BA8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 2rem;
    font-size: 1.875rem;
    text-align: center;
    font-weight: 700;
    letter-spacing: -0.5px;
  }
  
  .form-field {
    margin-bottom: 1.75rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.625rem;
    color: #334155;
    font-weight: 600;
    font-size: 0.95rem;
  }
  
  input[type="text"],
  textarea {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 1px solid rgba(166, 225, 250, 0.5);
    background-color: #f8fafc;
    border-radius: 0.75rem;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  input[type="text"]:focus,
  textarea:focus {
    outline: none;
    border-color: #0E6BA8;
    background-color: #ffffff;
    box-shadow: 0 0 0 4px rgba(14, 107, 168, 0.12), 
                inset 0 2px 4px rgba(0, 0, 0, 0.03);
  }
  
  input[type="text"]::placeholder,
  textarea::placeholder {
    color: #94a3b8;
  }
  
  textarea {
    min-height: 7rem;
    resize: vertical;
  }
  
  .user-selection {
    margin-top: 2.5rem;
  }
  
  .search-container {
    position: relative;
    margin-bottom: 1.5rem;
  }
  
  .dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1),
                0 4px 10px rgba(0, 0, 0, 0.05);
    z-index: 10;
    max-height: 320px;
    overflow-y: auto;
    border: 1px solid rgba(226, 232, 240, 0.8);
  }
  
  .dropdown-content {
    padding: 0.5rem;
  }
  
  .user-item {
    display: flex;
    align-items: center;
    padding: 0.875rem 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 0.5rem;
  }
  
  .user-item:hover {
    background-color: rgba(166, 225, 250, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(14, 107, 168, 0.08);
  }
  
  .user-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .user-info {
    margin-left: 0.875rem;
    flex: 1;
  }
  
  .user-name {
    font-weight: 600;
    color: #1e293b;
  }
  
  .user-username {
    font-size: 0.875rem;
    color: #64748b;
  }
  
  .selected-users-container {
    margin-top: 2rem;
  }
  
  .selected-users-container h3 {
    color: #334155;
    font-size: 1.125rem;
    margin-bottom: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
  
  .selected-users-container h3::before {
    content: '';
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: #0E6BA8;
    border-radius: 50%;
    margin-right: 0.5rem;
  }
  
  .selected-users {
    background-color: #fafcff;
    border: 1px solid rgba(166, 225, 250, 0.6);
    border-radius: 0.75rem;
    padding: 1.25rem;
    max-height: 320px;
    overflow-y: auto;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
  }
  
  .no-users {
    color: #94a3b8;
    font-style: italic;
    text-align: center;
    padding: 1.5rem 0;
  }
  
  .users-list {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }
  
  .selected-user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    padding: 0.875rem 1rem;
    border-radius: 0.625rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05), 
                0 1px 3px rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
    border: 1px solid rgba(226, 232, 240, 0.9);
  }
  
  .selected-user-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 
                0 2px 4px rgba(0, 0, 0, 0.04);
    transform: translateY(-1px);
  }
  
  .user-display {
    display: flex;
    align-items: center;
  }
  
  .remove-btn {
    background-color: #f1f5f9;
    color: #64748b;
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  .remove-btn:hover {
    background-color: #ef4444;
    color: white;
    box-shadow: 0 2px 5px rgba(239, 68, 68, 0.3);
  }
  
  .submit-btn {
    display: block;
    width: 100%;
    background: linear-gradient(135deg, #0E6BA8, #0A2472);
    color: white;
    border: none;
    padding: 1.125rem;
    border-radius: 0.75rem;
    font-size: 1.0625rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 2.5rem;
    box-shadow: 0 4px 12px rgba(10, 36, 114, 0.15),
                0 1px 3px rgba(10, 36, 114, 0.1);
    letter-spacing: 0.3px;
    position: relative;
    overflow: hidden;
  }
  
  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(10, 36, 114, 0.25),
                0 2px 4px rgba(10, 36, 114, 0.15);
  }
  
  .submit-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(10, 36, 114, 0.2);
  }
  
  /* Scrollbar styling */
  .dropdown-content::-webkit-scrollbar,
  .selected-users::-webkit-scrollbar {
    width: 8px;
  }
  
  .dropdown-content::-webkit-scrollbar-track,
  .selected-users::-webkit-scrollbar-track {
    background: rgba(241, 245, 249, 0.8);
    border-radius: 10px;
  }
  
  .dropdown-content::-webkit-scrollbar-thumb,
  .selected-users::-webkit-scrollbar-thumb {
    background: rgba(14, 107, 168, 0.2);
    border-radius: 10px;
  }
  
  .dropdown-content::-webkit-scrollbar-thumb:hover,
  .selected-users::-webkit-scrollbar-thumb:hover {
    background: rgba(14, 107, 168, 0.4);
  }
  </style>