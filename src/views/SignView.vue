<template>
  <div class="outer">
    <div class="form-container">
      <h1 class="form-header">Sign Up</h1>
      <form class="signup-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" placeholder="Enter your username" required />
        </div>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" placeholder="Enter your full name" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" required />
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <input type="password" id="confirm-password" placeholder="Confirm your password" required />
        </div>
        <div class="form-group">
          <label for="date">Date of Birth</label>
          <input type="date" id="date" required />
        </div>
        <div class="form-group">
          <label for="gender">Gender</label>
          <select id="gender" required>
            <option value="" disabled selected>Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <button type="submit" class="submit-button">Sign Up</button>
      </form>
      <!-- Added button to navigate to login -->
      <button class="switch-btn" @click="router.push('/login')">Already have an account? Log In!</button>
    </div>
  </div>
</template>

<script setup>
// Import Vue Router
import { useRouter } from 'vue-router';


const router = useRouter();
</script>














<style scoped>
/* Outer container with background style from LandingView */
.outer {
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #e0e0ff, rgb(53, 99, 121), #d4d4ff);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Updated form-container styles */
.form-container {
  width: 80%; /* Make the form width responsive */
  max-width: 600px; /* Limit the maximum width */
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 1.5rem;
  font-family: 'Poppins', sans-serif;
  color: #333;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #555;
}

input,
select {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:focus,
select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
}

.submit-button {
  padding: 0.75rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

.switch-btn {
  margin-top: 1rem;
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.9rem;
}

.switch-btn:hover {
  color: #0056b3;
}
</style>