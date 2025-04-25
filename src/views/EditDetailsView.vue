<template>
    <div class="edit-details-container">
  
      <!-- Chat Attributes Section -->
      <div class="chat-attributes">
        <h1>Edit Details</h1>
        <form class="chat-form">
          <div class="form-group">
            <label for="chat-name">Chat Name</label>
            <input type="text" id="chat-name" v-model="chat.name" placeholder="Enter chat name" />
          </div>
          <div class="form-group">
            <label for="chat-bio">Chat Bio</label>
            <textarea id="chat-bio" v-model="chat.bio" placeholder="Enter chat bio"></textarea>
          </div>
        </form>
      </div>
  
      <!-- Users Section -->
      <div class="users-section">
        <h2>Manage Participants</h2>
        <div class="search-container">
          <div class="search-wrapper">
            <i class="fa fa-search search-icon"></i>
            <input type="text" v-model="searchQuery" placeholder="Search participants..." class="search-input" />
          </div>
        </div>
        <div class="users-list">
          <div class="user-item" v-for="user in displayedUsers" :key="user.id">
            <div class="user-info">
              <div class="avatar-container">
                <img 
                  :src="user.imgURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'" 
                  :alt="user.name" 
                  class="user-avatar" 
                />
              </div>
              <div class="user-details">
                <span class="user-name">{{ user.name }}</span>
                <span class="user-username">@{{ user.username }}</span>
              </div>
            </div>
            <div class="user-actions">
              <button 
                class="admin-btn" 
                :class="{ 'is-admin': isAdmin(user.id) }" 
                @click="makeAdmin(user.id)"
                v-if="user.id !== auth.currentUser.uid"
              >
                {{ isAdmin(user.id) ? 'Admin' : 'Make Admin' }}
              </button>
              <button class="delete-btn" @click="deleteUser(user.id)" v-if="user.id !== auth.currentUser.uid">
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </div>
          
          <div v-if="displayedUsers.length === 0" class="no-results">
            <p>No participants found</p>
          </div>
        </div>
  
        <div class="action-buttons">
          <button class="save-btn">Save Changes</button>
          <button class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { db, auth } from '@/Firebase/config';
  import { useRoute, useRouter } from 'vue-router';
  
  const router = useRouter();
  const route = useRoute();
  const searchQuery = ref('');
  const usersData = ref([]);
  
  const chat = ref({
    id: null,
    isGroup: false,
    isCommunity: false,
    participants: [],
    bio: "",
    name: "",
    admins: [],
  });
  
  const displayedUsers = computed(() => {
    if (!searchQuery.value) {
      return usersData.value;
    }
    const query = searchQuery.value.toLowerCase();
    return usersData.value.filter(
      user => user.name.toLowerCase().includes(query) || 
             user.username.toLowerCase().includes(query)
    );
  });
  
  const isAdmin = (userId) => {
    return chat.value.admins && chat.value.admins.includes(userId);
  };

  const addListener = async () =>{
    const chatid = route.params.id;
    const chatDoc = db.collection("chats").doc(chatid).onSnapshot((doc) => {
      if (doc.exists) {
        chat.value = { id: doc.id, ...doc.data() };
        fetchUsersData();
      }
    });
}

  
  onMounted(async () => {
    const chatid = route.params.id;
    try {
      const chatDoc = await db.collection("chats").doc(chatid).get();
      if (chatDoc.exists) {
        chat.value = { id: chatDoc.id, ...chatDoc.data() };
        await addListener();
      } else {
        router.push({ name: "community", params: { id: chatid } });
      }
    } catch (e) {
      alert("There was an issue loading the page. Try again.");
      router.push({ name: "community", params: { id: chatid } });
    }

  });
  
  const fetchUsersData = async () => {
    if (!chat.value.participants || chat.value.participants.length === 0) return;
    
    try {
      const userData = await Promise.all(
        chat.value.participants.map(async (userId) => {
          const userDoc = await db.collection('users').doc(userId).get();
          if (userDoc.exists) {
            return { id: userDoc.id, ...userDoc.data() };
          }
          return { id: userId, name: 'Unknown User', username: 'unknown', imgURL: null };
        })
      );
      usersData.value = userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  
  // Placeholder functions for buttons
  const makeAdmin = (userId) => {
    console.log(`Make ${userId} an admin`);
  };
  
  const deleteUser = (userId) => {
    console.log(`Delete ${userId}`);
  };
  </script>
  
  <style scoped>
  
  
  .edit-details-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2.5rem;
    background-color: var(--white);
    border-radius: 20px;
    box-shadow: 0 12px 30px rgba(79, 70, 229, 0.1);
    border: 1px solid rgba(79, 70, 229, 0.08);
    height:80%;
    --primary-color: #4f46e5;
    --primary-light: #eef2ff;
    --primary-dark: #3730a3;
    --secondary-color: #8b5cf6;
    --secondary-light: #f5f3ff;
    --background-color: #f9fafe;
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --border-color: #e5e7eb;
    --white: #ffffff;
    --danger: #ef4444;
    --danger-light: #fee2e2;
    --success: #10b981;
    --success-light: #d1fae5;
  }
  
  h1 {
    text-align: center;
    color: var(--primary-dark);
    font-size: 2.2rem;
    margin-bottom: 2.5rem;
    font-weight: 700;
    position: relative;
    padding-bottom: 0.75rem;
  }
  
  h1::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    border-radius: 2px;
  }
  
  h2 {
    color: var(--text-primary);
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
    border-bottom: 2px solid var(--primary-light);
    padding-bottom: 0.75rem;
    position: relative;
  }
  
  h2::before {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  }
  
  .chat-attributes {
    margin-bottom: 3rem;
    background-color: var(--white);
    padding: 1.5rem;
    border-radius: 16px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
    border: 1px solid var(--border-color);
  }
  
  .chat-form {
    display: flex;
    flex-direction: column;
    gap: 1.8rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  }
  
  label {
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
    font-size: 1rem;
  }
  
  input, textarea {
    padding: 1rem 1.2rem;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
  }
  
  input:focus, textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
  
  textarea {
    resize: vertical;
    min-height: 120px;
  }
  
  .users-section {
    background-color: var(--white);
    padding: 1.5rem;
    border-radius: 16px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
    border: 1px solid var(--border-color);
  }
  
  .search-container {
    margin-bottom: 1.5rem;
  }
  
  .search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .search-icon {
    position: absolute;
    left: 1rem;
    color: var(--text-secondary);
  }
  
  .search-input {
    width: 100%;
    padding: 1rem 1rem 1rem 2.5rem;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    background-color: var(--white);
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .search-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  }
  
  .users-list {
    max-height: 450px;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 0.75rem;
    background-color: var(--white);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
  }
  
  .user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.2rem;
    border-radius: 10px;
    margin-bottom: 0.75rem;
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }
  
  .user-item:hover {
    background-color: var(--primary-light);
    border-color: rgba(79, 70, 229, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }
  
  .avatar-container {
    position: relative;
  }
  
  .user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--white);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  
  .user-name {
    font-size: 1.05rem;
    color: var(--text-primary);
    font-weight: 600;
  }
  
  .user-username {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
  
  .user-actions {
    display: flex;
    gap: 1rem;
  }
  
  button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .admin-btn {
    background-color: var(--secondary-light);
    color: var(--secondary-color);
    border: 1px solid rgba(139, 92, 246, 0.2);
  }
  
  .admin-btn:hover {
    background-color: var(--secondary-color);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(139, 92, 246, 0.25);
  }
  
  .admin-btn.is-admin {
    background-color: var(--secondary-color);
    color: white;
    border: 1px solid var(--secondary-color);
  }
  
  .delete-btn {
    background-color: var(--danger-light);
    color: var(--danger);
    border: 1px solid rgba(239, 68, 68, 0.2);
    width: 40px;
    height: 40px;
    padding: 0;
  }
  
  .delete-btn:hover {
    background-color: var(--danger);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(239, 68, 68, 0.25);
  }
  
  .no-results {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
    color: var(--text-secondary);
    font-style: italic;
    font-size: 1rem;
    background-color: var(--primary-light);
    border-radius: 8px;
  }
  
  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .save-btn {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: 0.8rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
  }
  
  .save-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.4);
  }
  
  .cancel-btn {
    background-color: var(--white);
    color: var(--text-secondary);
    padding: 0.8rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 10px;
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
  }
  
  .cancel-btn:hover {
    background-color: var(--border-color);
    color: var(--text-primary);
  }
  
  /* Custom scrollbar */
  .users-list::-webkit-scrollbar {
    width: 8px;
  }
  
  .users-list::-webkit-scrollbar-track {
    background: var(--primary-light);
    border-radius: 10px;
  }
  
  .users-list::-webkit-scrollbar-thumb {
    background: linear-gradient(var(--primary-color), var(--secondary-color));
    border-radius: 10px;
  }
  
  .users-list::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark);
  }
  
  /* Add some animation */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .edit-details-container {
    animation: fadeIn 0.5s ease forwards;
  }
  
  .user-item {
    animation: fadeIn 0.3s ease forwards;
    animation-delay: calc(0.05s * var(--i, 0));
  }
  </style>