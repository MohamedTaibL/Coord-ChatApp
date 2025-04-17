<template>
  <div class="main-container">
    <!-- Header with enhanced visual appeal -->
    <header class="header">
      <div class="header-content">
        <h1 class="app-title">Coord</h1>
        <div class="header-circles">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        </div>
      </div>
    </header>

    <!-- Testimonials with improved styling -->
    <section class="testimonials">
      <div class="quote-container">
        <div class="quote-mark">"</div>
        <blockquote>
          I've never been happier using a chat application, I can easily talk with my grandchildren! It is very simple!
          <footer>— Unknown old man</footer>
        </blockquote>
      </div>
      <div class="quote-container">
        <div class="quote-mark">"</div>
        <blockquote>
          I love Coord! Too simple yet not any simpler!
          <footer>— Unknown Kid</footer>
        </blockquote>
      </div>
    </section>

    <!-- Feature Boxes with improved icons and styling -->
    <section class="feature-boxes">
      <div class="feature-box">
        <div class="icon-container">
          <div class="icon">
            <font-awesome-icon :icon="['fas', 'check-circle']" />
          </div>
        </div>
        <h3>Simplicity</h3>
        <p>Coord is intuitive and user-friendly, making it perfect for people of all ages!</p>
        
        <div class="icon-container">
          <div class="icon">
            <font-awesome-icon :icon="['fas', 'exchange-alt']" />
          </div>
        </div>
        <h3>Flexibility</h3>
        <p>Connect privately with friends individually or in groups, or join public communities that match your interests!</p>
      </div>

      <div class="feature-box">
        <div class="icon-container">
          <div class="icon">
            <font-awesome-icon :icon="['fas', 'shield-alt']" />
          </div>
        </div>
        <h3>Security</h3>
        <p>Your privacy matters to us. We prioritize protecting your personal information and never sell your data for advertising purposes. With Coord, you can communicate with confidence knowing your conversations remain private and secure.</p>
      </div>
    </section>

    <!-- Call to Action with improved button styling -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>What are you waiting for?</h2>
        <button class="btn btn-signup">Sign Up</button>
        
        <div class="login-prompt">
          <p>Already have an account?</p>
          <button class="btn btn-login">Login</button>
        </div>
      </div>
      
      <!-- Decorative elements -->
      <div class="cta-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Import Vue and Font Awesome components
import { ref, onMounted } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faExchangeAlt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Add icons to the library
library.add(faCheckCircle, faExchangeAlt, faShieldAlt);

// Component setup code
const mounted = ref(false);

function createBubbles() {
  const mainContainer = document.querySelector('.main-container');
  const bubbleCount = 10;
  
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Random size between 50px and 150px
    const size = Math.random() * 100 + 50;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // Random starting position along the bottom of the container
    bubble.style.bottom = '-50px'; // Start slightly below the container
    bubble.style.left = `${Math.random() * 100}%`;
    
    // Random animation duration between 15 and 40 seconds
    const duration = Math.random() * 25 + 15;
    bubble.style.animation = `float-bubble ${duration}s ease-in-out infinite`;
    bubble.style.animationDelay = `${Math.random() * 5}s`;
    
    // Random opacity and blur
    bubble.style.opacity = `${Math.random() * 0.3 + 0.1}`; // Slightly increased opacity
    bubble.style.filter = `blur(${Math.random() * 3 + 1}px)`;
    
    // Append to mainContainer instead of document.body
    mainContainer.appendChild(bubble);
  }
}

// Call this in your onMounted hook
onMounted(() => {
  mounted.value = true;
  createBubbles();
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Poppins:wght@300;400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Poppins:wght@300;400;500;700&family=Nunito:wght@300;400;600&display=swap');

:root {
  --dark-blue: #00072D;
  --navy: #001C55;
  --blue: #0A2472;
  --light-blue: #0E6BA8;
  --pale-blue: #A6E1FA;
  --bg-color: rgb(191, 191, 245);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  color: var(--dark-blue);
  line-height: 1.6;
  background: linear-gradient(135deg, #e0e0ff 0%, rgb(191, 191, 245) 100%);
  position: relative;
  overflow-x: hidden;
}

body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: 
    radial-gradient(circle at 20% 20%, rgba(166, 225, 250, 0.4) 0%, transparent 25%),
    radial-gradient(circle at 80% 50%, rgba(14, 107, 168, 0.2) 0%, transparent 30%),
    radial-gradient(circle at 40% 80%, rgba(10, 36, 114, 0.15) 0%, transparent 35%);
  animation: pulse 15s infinite alternate ease-in-out;
}

body::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -2;
  opacity: 0.6;
  background: 
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%230a2472' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
    linear-gradient(135deg, rgba(166, 225, 250, 0.1) 0%, rgba(14, 107, 168, 0.1) 100%);
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  overflow: hidden; /* Add this to contain the bubbles */
  min-height: 100vh; /* Ensure container has enough height for bubbles */
}

/* Enhanced Header styles */
.header {
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, var(--blue), var(--light-blue));
  border-radius: 16px;
  margin-bottom: 3rem;
  box-shadow: 0 8px 30px rgba(14, 107, 168, 0.3);
  position: relative;
  overflow: hidden;
  z-index: 2; /* Ensure it's above bubbles */
}

.header-content {
  position: relative;
  z-index: 2;
}

.header-circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background-color: white;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: 10%;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 30%;
  right: 20%;
}

.app-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 5rem;
  font-weight: 700;
  color: white;
  letter-spacing: 3px;
  text-shadow: 3px 3px 6px rgba(0, 7, 45, 0.4);
  margin-bottom: 1rem;
  background-clip: text;
}

/* Enhanced Testimonials section */
.testimonials {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2; /* Ensure it's above bubbles */
}

.quote-container {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  padding: 2.5rem;
  margin: 1rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 28, 85, 0.1);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.quote-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 28, 85, 0.15);
}

.quote-mark {
  position: absolute;
  top: 10px;
  left: 20px;
  font-size: 4rem;
  color: var(--pale-blue);
  font-family: 'Georgia', serif;
  opacity: 0.4;
  line-height: 1;
}

blockquote {
  font-size: 1.2rem;
  font-style: italic;
  color: var(--blue);
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

blockquote footer {
  font-style: normal;
  font-weight: 500;
  text-align: right;
  color: var(--light-blue);
  font-size: 0.9rem;
}

/* Enhanced Feature boxes */
.feature-boxes {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2; /* Ensure it's above bubbles */
}

.feature-box {
  flex: 1;
  min-width: 300px;
  padding: 2.5rem;
  margin: 1rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 28, 85, 0.1);
  transition: transform 0.3s ease;
}

.feature-box:hover {
  transform: translateY(-5px);
}

.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
}

.icon {
  font-size: 2.5rem;
  color: var(--light-blue);
  background: linear-gradient(135deg, var(--pale-blue), var(--light-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-box h3 {
  font-family: 'Montserrat', sans-serif;
  color: var(--navy);
  margin-bottom: 0.8rem;
  font-size: 1.6rem;
  text-align: center;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.feature-box p {
  color: var(--dark-blue);
  margin-bottom: 1.8rem;
  text-align: center;
  line-height: 1.8;
  font-family: 'Nunito', sans-serif;
  font-weight: 400;
  font-size: 1.05rem;
  letter-spacing: 0.3px;
}

/* Enhanced Call to Action section */
.cta-section {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, var(--blue), var(--light-blue));
  border-radius: 16px;
  color: white;
  box-shadow: 0 10px 30px rgba(10, 36, 114, 0.3);
  position: relative;
  overflow: hidden;
  z-index: 2; /* Ensure it's above bubbles */
}

.cta-content {
  position: relative;
  z-index: 2;
}

.cta-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
}

.shape-1 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -100px;
  animation: float 8s ease-in-out infinite;
}

.shape-2 {
  width: 200px;
  height: 200px;
  top: -80px;
  right: -50px;
  animation: float 10s ease-in-out infinite;
  animation-delay: 1s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: 30%;
  right: 10%;
  animation: float 7s ease-in-out infinite;
  animation-delay: 2s;
}

@keyframes float {
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

.cta-section h2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.btn {
  padding: 1rem 2.5rem;
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  letter-spacing: 0.5px;
}

.btn-signup {
  background: white;
  color: var(--blue);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  margin-bottom: 2.5rem;
  position: relative;
  overflow: hidden;
}

.btn-signup:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
}

.btn-signup::after {
  content: '';
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: -100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: all 0.6s ease;
}

.btn-signup:hover::after {
  left: 100%;
}

.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-prompt p {
  margin-bottom: 0.8rem;
  font-size: 1rem;
  opacity: 0.9;
}

.btn-login {
  background-color: transparent;
  color: white;
  border: 2px solid white;
  padding: 0.8rem 2rem;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
}

.btn-login:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .app-title {
    font-size: 3.5rem;
  }
  
  .feature-boxes {
    flex-direction: column;
  }
  
  .feature-box {
    margin: 1rem 0;
  }
  
  .testimonials {
    flex-direction: column;
    align-items: center;
  }
  
  .quote-container {
    margin: 1rem 0;
  }
  
  .cta-section h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .app-title {
    font-size: 2.5rem;
  }
  
  .btn {
    padding: 0.8rem 1.8rem;
  }
  
  .cta-section h2 {
    font-size: 1.8rem;
  }
}

/* Bubble styling */
.bubble {
  position: absolute;
  background: linear-gradient(135deg, rgba(166, 225, 250, 0.3), rgba(14, 107, 168, 0.1));
  border-radius: 50%;
  pointer-events: none;
  z-index: 1; /* Make sure bubbles appear behind content */
  box-shadow: 0 0 10px rgba(166, 225, 250, 0.2);
}

@keyframes float-bubble {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes pulse {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}
</style>