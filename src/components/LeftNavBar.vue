<template>
    <div class="navbar">
        <div class="nav-top">
            <div class="nav-item">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M220-260q-92 0-156-64T0-480q0-92 64-156t156-64q37 0 71 13t61 37l68 62-60 54-62-56q-16-14-36-22t-42-8q-58 0-99 41t-41 99q0 58 41 99t99 41q22 0 42-8t36-22l310-280q27-24 61-37t71-13q92 0 156 64t64 156q0 92-64 156t-156 64q-37 0-71-13t-61-37l-68-62 60-54 62 56q16 14 36 22t42 8q58 0 99-41t41-99q0-58-41-99t-99-41q-22 0-42 8t-36 22L352-310q-27 24-61 37t-71 13Z"/></svg>
                <p style="color:white; margin: 0px;">C<span style="color: gold">oo</span>rd</p>
            </div>
            </div>
        </div>
        <div class="nav-middle">
            <div class="nav-item">
                <div class="dropdown-container">
                    <button class="nav-button" @click = 'showDropdown =!showDropdown':class="{ active: activeButton === 'create' }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="nav-icon">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                    <div class="dropdown-menu" v-if="showDropdown">
                        <button class="dropdown-item" @click="createCommunity">
                            Create Community
                        </button>
                        <button class="dropdown-item" @click="createPrivateGroup">
                            Create Private Group Chat
                        </button>
                    </div>
                </div>
            </div>
            <!-- Other nav items remain the same -->
            <div class="nav-item">
                <button class="nav-button" :class="{ active: activeButton === 'community' }" @click="setActiveButton('community') ; router.push({name: 'community'})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="nav-icon">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </button>
            </div>
            <div class="nav-item">
                <button class="nav-button" :class="{ active: activeButton === 'chat' }" @click="setActiveButton('chat') ; router.push({name : 'private'}) ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="nav-icon">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            </div>
        </div>
      <!-- Profile and Dropdown -->
      <div class="nav-bottom">
        <div class="nav-item profile-container">
          <button class="nav-button profile" @click="showProfileDropdown = !showProfileDropdown">
            <img :src="img" alt="Profile" class="profile-img" v-if="img" />
            <div class="loading-spinner" v-else></div>
          </button>
          <div class="profile-dropdown" v-if="showProfileDropdown">
            <button class="dropdown-item light" @click="viewProfile">View Profile</button>
            <button class="dropdown-item light" @click="signOut">Sign Out</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { db, auth } from '@/Firebase/config'
import { onMounted, ref ,watch} from 'vue';
import { useRouter } from 'vue-router';

// Variables
const img = ref("");
const activeButton = ref("chat");
const showDropdown = ref(false);
const showProfileDropdown = ref(false);
const router = useRouter()

// Functions
const setActiveButton = (buttonName) => {
    activeButton.value = buttonName; 
    if (showDropdown.value ) showDropdown.value = !showDropdown.value
    if (showProfileDropdown.value) showProfileDropdown.value = false;
};

const createCommunity = () => {
    activeButton.value = 'create'
    router.push({name : 'createcommunity'})
    showDropdown.value = false;
};

watch(
  () => router.currentRoute.value,
  (to) => {
    // set the class of the active button accordingly
    if (to.name === 'community') {
        activeButton.value = 'community';
    } else if (to.name === 'private' || to.name === 'new') {
        activeButton.value = 'chat';
    } else if (to.name === 'createcommunity' || to.name === 'creategroup') {
        activeButton.value = 'create';
    }
    else {
        activeButton.value = '';
    }
  }
  ,{immediate: true}
)


const createPrivateGroup = () => {
    console.log("Creating private group chat...");
    // Add your private group creation logic here
    router.push('/creategroup');
    showDropdown.value = false;
  };
  
  const viewProfile = () => {
    showProfileDropdown.value = false;
    router.push({ name: 'viewprofile', params: { id: auth.currentUser.uid } });
  };
  
  const signOut = async () => {
    showProfileDropdown.value = false;
    await auth.signOut();
    router.push({ name: 'login' });
  };
  
  onMounted(async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user && user.uid) {
        const userRef = await db.collection("users").doc(user.uid).get();
        const userInfo = userRef.data();
        img.value = userInfo.imgURL;
      }
    });
  });
  </script>
  



<style scoped>
/* Existing styles remain the same */

.dropdown-container {
    position: relative;
    display: flex;
    justify-content: center;
}

.dropdown-menu {
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    background-color: #0A2472;
    border-radius: 8px;
    padding: 8px 0;
    min-width: 180px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1001;
}

.dropdown-item {
    display: block;
    width: 100%;
    padding: 8px 16px;
    text-align: left;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
}

.dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.loading-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top: 3px solid white;
    border-right: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 8px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.navbar {
    top: 0;
    left: 0;
    min-height: 100vh;
    height: 100%;
    width: 72px;
    background-color: #0A2472;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
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
  
  .nav-button.active {
    background-color: rgb(243, 156, 18, 0.898);
  }
  
  .nav-icon {
    width: 22px;
    height: 22px;
  }
  
  .profile-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
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
  
  .profile-dropdown {
  position: absolute;
  left: 60px; /* shift it to the right */
  bottom: 0;
  background-color: #f1f1f1;
  border-radius: 8px;
  padding: 8px 0;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
}

  
  .dropdown-container {
    position: relative;
    display: flex;
    justify-content: center;
  }
  
  .dropdown-menu {
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    background-color: #0A2472;
    border-radius: 8px;
    padding: 8px 0;
    min-width: 180px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1001;
  }
  
  .dropdown-item {
    display: block;
    width: 100%;
    padding: 8px 16px;
    text-align: left;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .dropdown-item.light {
    color: #0A2472;
    background-color: transparent;
  }
  
  .dropdown-item.light:hover {
    background-color: rgba(10, 36, 114, 0.1);
  }
  
  .dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .loading-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top: 3px solid white;
    border-right: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 8px;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
  
    100% {
      transform: rotate(360deg);
    }
  }
  </style>
  