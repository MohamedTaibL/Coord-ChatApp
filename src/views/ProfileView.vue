<template>
    <div class="profile-container">
      <div v-if="!infos" class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading your profile...</div>
      </div>
      <div v-else class="profile-card">
        <div class="profile-header">
          <div class="profile-banner"></div>
          <div class="profile-avatar-container">
            <img :src="infos.imgURL" alt="Profile picture" class="profile-avatar" />
          </div>
          <div class="settings-button" v-if="auth.currentUser.uid == $route.params.id">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
        </div>
        
        <div class="profile-content">
          <div class="profile-identity">
            <h1 class="name">{{ infos.name }}</h1>
            <h2 class="username">@{{ infos.username }}</h2>
          </div>
          
          <div v-if="infos.bio" class="bio-section">
            <p class="bio-text">{{ infos.bio }}</p>
          </div>
          
          <div class="profile-details">
            <div class="detail-card">
              <div class="detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div class="detail-content">
                <span class="detail-label">Email</span>
                <span class="detail-value">{{ infos.email }}</span>
              </div>
            </div>
            
            <div class="detail-card">
              <div class="detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div class="detail-content">
                <span class="detail-label">Birthday</span>
                <span class="detail-value">{{ formatBirthday(infos.birthday) }}</span>
              </div>
            </div>
            
            <div class="detail-card">
              <div class="detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="detail-content">
                <span class="detail-label">Gender</span>
                <span class="detail-value">{{ infos.gender=="female"? "Female" : "Male" }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { db, auth } from '@/Firebase/config';
  
  // Variables
  const infos = ref(null);
  
  // Functions
  onMounted(async () => {
    const userRef = await db.collection('users').doc(auth.currentUser.uid).get();
    infos.value = userRef.data();
  });
  
  // Format birthday to a more readable format
  const formatBirthday = (birthday) => {
    if (!birthday) return 'Not specified';
    
    // If birthday is a Firebase timestamp
    if (birthday.toDate) {
      const date = birthday.toDate();
      return new Intl.DateTimeFormat('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }).format(date);
    }
    
    // If birthday is a date string or other format
    return birthday;
  };
  </script>
  
  <style scoped>
  .profile-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 30px 20px;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
  
  .loading-container {
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(10, 36, 114, 0.1);
    border-radius: 50%;
    border-top-color: #0A2472;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 20px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .loading-text {
    color: #0A2472;
    font-size: 18px;
    font-weight: 500;
  }
  
  .profile-card {
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(10, 36, 114, 0.1);
    overflow: hidden;
    position: relative;
  }
  
  .profile-header {
    position: relative;
    height: 200px;
  }
  
  .profile-banner {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0A2472, #0E6BA8, #14A9DB);
    z-index: 1;
  }
  
  .profile-avatar-container {
    position: absolute;
    bottom: -60px;
    left: 50px;
    z-index: 2;
  }
  
  .profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 5px solid white;
    box-shadow: 0 5px 15px rgba(10, 36, 114, 0.2);
    object-fit: cover;
    background-color: #f0f0f0;
  }
  
  .settings-button {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    transition: all 0.3s ease;
  }
  
  .settings-button:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: rotate(30deg);
  }
  
  .settings-button svg {
    color: white;
    width: 24px;
    height: 24px;
  }
  
  .profile-content {
    padding: 70px 50px 50px;
  }
  
  .profile-identity {
    margin-bottom: 30px;
    text-align: left;
  }
  
  .name {
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 8px;
    color: #001233;
  }
  
  .username {
    font-size: 18px;
    color: #0A2472;
    font-weight: 500;
    margin: 0;
    opacity: 0.8;
  }
  
  .bio-section {
    background-color: #f8fbff;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 30px;
    border-left: 4px solid #0A2472;
  }
  
  .bio-text {
    margin: 0;
    color: #333;
    font-size: 16px;
    line-height: 1.6;
  }
  
  .profile-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .detail-card {
    background-color: #f8fbff;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 12px rgba(10, 36, 114, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .detail-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(10, 36, 114, 0.1);
  }
  
  .detail-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #0A2472, #0E6BA8);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    flex-shrink: 0;
  }
  
  .detail-icon svg {
    color: white;
    width: 24px;
    height: 24px;
  }
  
  .detail-content {
    display: flex;
    flex-direction: column;
  }
  
  .detail-label {
    color: #0A2472;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .detail-value {
    color: #333;
    font-size: 16px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  @media (max-width: 768px) {
    .profile-avatar-container {
      left: 50%;
      transform: translateX(-50%);
    }
    
    .profile-content {
      padding: 80px 30px 40px;
      text-align: center;
    }
    
    .profile-identity {
      text-align: center;
    }
    
    .profile-details {
      grid-template-columns: 1fr;
    }
  }
  </style>