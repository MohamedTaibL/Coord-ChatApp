<template>
    <div class="outer">
      <div class="form-container">
        <div class="login-view" v-if = "!isReset">
          <h1>Login</h1>
          <form class="form" @submit.prevent = "login">
            <input type="email" placeholder="Email" required v-model = "email" />
            <input type="password" placeholder="Password" required v-model="password" />
            <button type="submit" class="btn" >Login</button>
          </form>
          <button class="switch-btn" @click = "isReset = !isReset">Forgot Password?</button>
          <button class="switch-btn" @click = "router.push('/signup')">Don't have an account? Sign Up!</button>
          
        </div>
  
        <div class="reset-view" v-else >
          <h1>Reset Password</h1>
          <form class="form">
            <input type="email" placeholder="Email" required v-model="email" />
            <button type="submit" class="btn" @click="sendReset">Send Reset Link</button>
          </form>
          <button class="switch-btn" @click = "isReset = !isReset">Back to Login</button>
        </div>
      </div>
    </div>
  </template>



<script setup>
    //Imports:
    import { onMounted , ref} from 'vue';
    import {useRouter} from 'vue-router';
    import {db , auth} from '@/Firebase/config'



    // Variables:
    const router = useRouter()
    const isReset = ref(false);
    const user = auth.currentUser;
    const email = ref("")
    const password = ref("")






    // Functions:
    const sendReset = async () =>{
      try{
        await auth.sendPasswordResetEmail(email.value);
    }
      catch(error){
        alert("Enter a valid email, or verify your connection.");
        return false
    }
      finally{
        alert("A password reset email has been sent to " + email.value + ". Check your inbox!")
        isReset.value = !isReset.value
        return true;
    }
    
    }




    const login = async () => {
      try{
          console.log(email.value)
          const Credentials = await auth.signInWithEmailAndPassword(email.value , password.value);
          console.log("I got here")
          const user = Credentials.user
          if (user.emailVerified){
            router.push('/private')

          }
          else{
            await user.sendEmailVerification();
            await auth.signOut();
            alert("Please verify your email before logging in. Check your inbox for the verification email.");
            return false;
          }

      }

      catch(error){
          if (error.code == "auth/internal-error"){
            alert("Invalid Credentials.")
            return false;
          }
          else if (error.code == "auth/network-request-failed"){
            alert("Verify Your Connection.")
            return false;
          }

      }

      
    }

    


    onMounted(() =>{
        isReset.value = false;

    })


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
    width: 80%;
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    font-family: 'Poppins', sans-serif;
    color: #333;
  }
  
  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  }
  
  .btn {
    padding: 0.75rem;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn:hover {
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