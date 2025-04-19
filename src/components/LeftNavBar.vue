<template>
    <div class="navbar">
      <div class="nav-top">
        <!-- Empty space to push the middle section down -->
      </div>
      <div class="nav-middle">
        <div class="nav-item">
          <button class="nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <div class="nav-item">
          <button class="nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </button>
        </div>
        <div class="nav-item">
          <button class="nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="nav-bottom">
        <div class="nav-item">
          <button class="nav-button profile">
            <img :src="img" alt="Profile" class="profile-img">
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { db, auth } from '@/Firebase/config'
  import { onMounted, ref } from 'vue';
  
  // Variables
  const img = ref("")
  const userid = auth.currentUser.uid
  
  // Functions
  onMounted(async () => {
    const userRef = await db.collection("users").doc(userid).get()
    const userInfo = userRef.data()
    console.log(userInfo)
    img.value = userInfo.imgURL
  })
  </script>
  
  <style scoped>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 72px;
    background-color: #0A2472;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .nav-top {
    flex-grow: 1;
  }
  
  .nav-middle {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  
  .nav-bottom {
    padding-bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-grow: 1;
    align-items: flex-end;
  }
  
  .nav-item {
    margin: 12px 0;
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  .nav-button {
    background: transparent;
    border: none;
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    color: #fff;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .nav-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .nav-icon {
    width: 22px;
    height: 22px;
  }
  
  .profile {
    position: relative;
    width: 40px;
    height: 40px;
    padding: 0;
    overflow: hidden;
    border-radius: 50%;
    border: 2px solid #fff;
  }
  
  .profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  </style>