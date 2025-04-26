<template>
    <div class="details-container">
      <!-- Chat Header Section -->
      <div class="chat-header">
        <div class="chat-avatar">
          <img 
            v-if="chat.imgURL" 
            :src="chat.imgURL" 
            alt="Chat Image" 
            class="chat-image"
          />
          <div v-else class="avatar-placeholder">
            {{ getInitials(chat.name) }}
          </div>
        </div>
        <div class="chat-info">
          <div class="info-item">
            <span class="info-label">Name:</span>
            <h1 class="chat-name">{{ chat.name || '(Not Specified)' }}</h1>
          </div>
          <div class="info-item">
            <span class="info-label">Bio:</span>
            <p class="chat-bio">{{ chat.bio || '(Not Specified)' }}</p>
          </div>
        </div>
      </div>
  
      <!-- Members Section -->
      <div class="members-section">
        <div class="section-header">
          <h2>Members</h2>
          <span class="member-count">{{ members.length }}</span>
        </div>
        
        <div class="members-grid">
          <div 
            v-for="member in members" 
            :key="member.id"
            class="member-card"
            @click="$router.push({ name: 'viewprofile', params: { id: member.id } })"
          >
            <div class="member-avatar-wrapper">
              <img 
                :src="member.imgURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'" 
                :alt="member.name" 
                class="member-avatar" 
              />
            </div>
            
            <div class="member-info">
              <div class="member-info-item">
                <span class="member-name">{{ member.name || '(Not Specified)' }}</span>
              </div>
              <div class="member-info-item">
                <span class="member-username">@{{ member.username || '(Not Specified)' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { db } from '@/Firebase/config';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  
  const chat = ref({
    name: '',
    bio: '',
    imgURL: null
  });
  
  const members = ref([]);
  
  onMounted(async () => {
    const chatId = route.params.id;  // Get chat ID from route params
    try {
      // Fetch chat details
      const chatDoc = await db.collection('chats').doc(chatId).get();
      if (chatDoc.exists) {
        chat.value = chatDoc.data();
      }
  
      // Fetch members
      const participants = chat.value.participants || [];
      const memberData = await Promise.all(
        participants.map(async (userId) => {
          const userDoc = await db.collection('users').doc(userId).get();
          if (userDoc.exists) {
            return { id: userDoc.id, ...userDoc.data() };
          }
          return { id: userId, name: '(Not Specified)', username: '(Not Specified)', imgURL: null };
        })
      );
      members.value = memberData;
    } catch (error) {
      console.error('Error fetching chat details or members:', error);
    }
  });
  
  // Get initials from name for avatar placeholder
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Handle member card click - passes the userID
  const handleMemberClick = (userId) => {
    
  };
  </script>
  
  <style scoped>
  .details-container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 2.5rem;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  }
  
  /* Chat Header Styles */
  .chat-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 3rem;
    text-align: center;
    position: relative;
  }
  
  .chat-avatar {
    width: 90px;
    height: 90px;
    margin-bottom: 1.5rem;
    border-radius: 50%;
    overflow: hidden;
  }
  
  .chat-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    font-size: 2rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }
  
  .chat-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    max-width: 600px;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }
  
  .info-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .chat-name {
    font-size: 2.2rem;
    font-weight: 800;
    color: #111827;
    margin: 0;
    background: linear-gradient(to right, #4f46e5, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .chat-bio {
    font-size: 1.1rem;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
  }
  
  /* Members Section Styles */
  .members-section {
    margin-top: 2rem;
  }
  
  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .section-header h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-right: 1rem;
    margin-bottom: 0;
  }
  
  .member-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f4f6;
    color: #4f46e5;
    font-weight: 600;
    font-size: 0.875rem;
    height: 24px;
    padding: 0 10px;
    border-radius: 12px;
  }
  
  .members-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }
  
  .member-card {
    padding: 1.5rem;
    border-radius: 12px;
    background-color: #f9fafb;
    border: 1px solid #f3f4f6;
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .member-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
    border-color: #e5e7eb;
    background-color: #ffffff;
  }
  
  .member-avatar-wrapper {
    flex-shrink: 0;
  }
  
  .member-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .member-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow: hidden;
  }
  
  .member-info-item {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }
  
  .member-name {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .member-username {
    font-size: 0.875rem;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .details-container {
      padding: 1.5rem;
      margin: 1rem;
    }
    
    .members-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .chat-name {
      font-size: 1.8rem;
    }
    
    .chat-bio {
      font-size: 1rem;
    }
  }
  </style>