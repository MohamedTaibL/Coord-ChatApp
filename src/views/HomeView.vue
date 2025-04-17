<template>
  <div class="main-container">
    <!-- Header -->
    <header class="header">
      <h1 class="app-title">Coord</h1>
    </header>

    <!-- Testimonials -->
    <section class="testimonials">
      <div class="quote-container">
        <blockquote>
          "I've never been happier using a chat application, I can easily talk with my grandchildren! It is very simple!"
          <footer>— Unknown old man</footer>
        </blockquote>
      </div>
      <div class="quote-container">
        <blockquote>
          "I love Coord! Too simple yet not any simpler!"
          <footer>— Unknown Kid</footer>
        </blockquote>
      </div>
    </section>

    <!-- Feature Boxes -->
    <section class="feature-boxes">
      <div class="feature-box">
        <div class="icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3>Simplicity</h3>
        <p>Coord is intuitive and user-friendly, making it perfect for people of all ages!</p>
        
        <div class="icon">
          <i class="fas fa-exchange-alt"></i>
        </div>
        <h3>Flexibility</h3>
        <p>Connect privately with friends individually or in groups, or join public communities that match your interests!</p>
      </div>

      <div class="feature-box">
        <div class="icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <h3>Security</h3>
        <p>Your privacy matters to us. We prioritize protecting your personal information and never sell your data for advertising purposes. With Coord, you can communicate with confidence knowing your conversations remain private and secure.</p>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <h2>What are you waiting for?</h2>
      <button class="btn btn-signup">Sign Up</button>
      
      <div class="login-prompt">
        <p>Already have an account?</p>
        <button class="btn btn-login">Login</button>
      </div>
    </section>
  </div>
</template>

<script setup>
// Your component logic would go here
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Poppins:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

:root {
  --dark-blue: #00072D;
  --navy: #001C55;
  --blue: #0A2472;
  --light-blue: #0E6BA8;
  --pale-blue: #A6E1FA;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: var(--pale-blue);
  color: var(--dark-blue);
  line-height: 1.6;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header styles */
.header {
  text-align: center;
  padding: 3rem 0;
  background: linear-gradient(to right, var(--navy), var(--blue));
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 7, 45, 0.3);
}

.app-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 4rem;
  font-weight: 700;
  color: white;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Testimonials section */
.testimonials {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.quote-container {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  padding: 2rem;
  margin: 1rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

blockquote {
  font-size: 1.1rem;
  font-style: italic;
  color: var(--blue);
  margin-bottom: 1rem;
}

blockquote footer {
  font-style: normal;
  font-weight: 500;
  text-align: right;
  color: var(--light-blue);
}

/* Feature boxes */
.feature-boxes {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.feature-box {
  flex: 1;
  min-width: 300px;
  padding: 2rem;
  margin: 1rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 2.5rem;
  color: var(--light-blue);
  margin-bottom: 1rem;
  margin-top: 1.5rem;
}

.feature-box h3 {
  font-family: 'Montserrat', sans-serif;
  color: var(--navy);
  margin-bottom: 0.5rem;
}

.feature-box p {
  color: var(--dark-blue);
  margin-bottom: 1.5rem;
}

/* Call to Action section */
.cta-section {
  text-align: center;
  padding: 3rem;
  background: linear-gradient(to right, var(--blue), var(--light-blue));
  border-radius: 10px;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 7, 45, 0.3);
}

.cta-section h2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: 600;
}

.btn {
  padding: 0.8rem 2rem;
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-signup {
  background-color: white;
  color: var(--blue);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
}

.btn-signup:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.login-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-prompt p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.btn-login {
  background-color: transparent;
  color: white;
  border: 2px solid white;
  padding: 0.6rem 1.8rem;
  font-size: 1rem;
}

.btn-login:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .app-title {
    font-size: 3rem;
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
}
</style>