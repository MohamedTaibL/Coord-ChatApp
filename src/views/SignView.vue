<template>
  <div class="outer">
    <div class="form-container">
      <h1 class="form-header">Sign Up</h1>
      <form class="signup-form" @submit.prevent = "addUser">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="username" placeholder="Enter your username" minlength="5" required />
        </div>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="name" placeholder="Enter your full name" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="Enter your email" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" placeholder="Enter your password" minlength="6" required />
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <input type="password" id="confirm-password" v-model="confpassword" placeholder="Confirm your password" minlength="6" :pattern="password" required/>
        </div>
        <div class="form-group">
          <label for="date">Date of Birth</label>
          <input type="date" id="date" v-model="date" required />
        </div>
        <div class="form-group">
          <label for="gender">Gender</label>
          <select id="gender" v-model="gender" required>
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
import {ref} from 'vue'
import {db , auth} from '@/Firebase/config'
//Variables:

const username = ref("")
const name = ref("")
const email = ref("")
const password = ref("")
const confpassword = ref("")
const date = ref("")
const gender = ref(null)



const router = useRouter();





//Functions:

const addUser = async () =>{
  try{
    const usersTable = db.collection("users");
    const querySnapshot = await usersTable.where('username' , '==' , username.value ).get();
    console.log(querySnapshot.empty);
    if (!querySnapshot.empty){
      alert("Username is already taken.")
      username.value = ""
      return false;
    }
    if (/\s/.test(username.value)) {
      alert("Username cannot contain spaces.");
      username.value = "";
      return false;
    }
  }
  
  catch(error){
    alert("Connection error, please try again!")
    return false;

  }

  try{
  
    const userCredential = await auth.createUserWithEmailAndPassword(email.value , password.value);
    const user = userCredential.user
    const imgURL = (gender.value === "male") 
  ? "https://img.freepik.com/premium-vector/vector-flat-illustration-gray-color-avatar-user-profile-person-icon-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-1101.jpg?w=740" 
  : "https://img.freepik.com/premium-vector/vector-flat-illustration-gray-color-avatar-user-profile-person-icon-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-943.jpg?w=740";

    await db.collection("users").doc(user.uid).set({
      username: username.value,
      name : name.value,
      email : email.value,
      birthday : date.value,
      gender : gender.value,
      imgURL : imgURL
    })

    
  }

  catch(error){
    alert("Email is already taken! Use a different one.");
    email.value = ''
    return false;

  }

  try {
    await auth.currentUser.sendEmailVerification();
    alert("Account Created Successfully!, A verification email has been sent, Check your inbox.");


  }
  catch(error){
    alert("Account Created Successfully!, Try Logging In To Get A Verification Email!");
  }
  finally{
    username.value = ''
    name.value = ''
    email.value = ''
    password.value = ''
    date.value = ''
    gender.value = ''
  }


}
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