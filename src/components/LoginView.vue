<script lang="ts">


import RegisterView from "@/components/RegisterView.vue";

export default {
    name: 'LoginView',
    methods: {
        async login() {
            const errorField = document.getElementById('error');

            const username = (document.getElementById('username') as HTMLInputElement).value;
            const password = (document.getElementById('password') as HTMLInputElement).value;

            if (errorField !== null) {
              if (username === '' || password === '') {
                return errorField.innerText = 'Please fill out all fields';
              } else if (password.length < 8) {
                return errorField.innerText = 'Password must be at least 8 characters long';
              } else if (username.length < 2) {
                return errorField.innerText = 'Username must be at least 2 characters long';
              } else if (username.length > 30) {
                return errorField.innerText = 'Username must be at most 30 characters long';
              } else {
                const response = await fetch('https://relacexyz.duckdns.org/api/auth/login/', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    "username": username,
                    "password": password
                  })
                });
                const data = await response.json();

                console.log(data);
                if (data.success) {
                  localStorage.setItem('token', data.jwt);
                  localStorage.setItem('refresh', data.refreshToken);
                  localStorage.setItem('username', username);
                  localStorage.setItem('key', RegisterView.methods!.stringToHash(password.substring(0, 4)).toString());
                  //@ts-ignore
                  this.$router.push('/home');
                } else {
                  errorField.innerText = data.message;
                }
              }
            }
        },
        goToRegister() {
            //@ts-ignore
            this.$router.push('/auth/signup');
            window.history.pushState(null, '', '/auth/signup');
        }
    },
    mounted: function (){
      document.getElementById('side-bar')!.style.display = 'none';
      document.getElementById('headline-container')!.style.display = 'none';
    },
    beforeUnmount: async function () {
        document.getElementById('side-bar')!.style.display = 'flex';
        document.getElementById('headline-container')!.style.display = 'flex';
    }
}
</script>

<template>
    <div id="welcome-container">
        <div id="content">
            <h1>Relace - Login</h1>
            <input @keydown.enter="login" id="username" type="text" placeholder="Username">
            <input @keydown.enter="login" id="password" type="password" placeholder="Password">
            <p id="error"></p>
          <div id="button-container">
            <button @click="login">Login</button>
            <button id="login-button" @click="goToRegister">Register instead</button>
          </div>
        </div>
    </div>
</template>

<style>
#content input {
    width: 90%;
    height: 30px;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: rgba(180, 180, 180, 0.281);
    border-radius: 15px;
    border-style: solid;
    color: rgba(240, 248, 255, 0.753);
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    border-color: #46004075;
    padding-left: 15px;
    padding-right: 15px;
    transition: all 0.25s ease-in-out;
}

#content input:focus {
    outline: none;
    border-color: #46004075;
    border-style: solid;
    border-radius: 7.5px;
}

#content input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active,
#content input {
    width: 90%;
    height: 30px;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: rgba(180, 180, 180, 0.281);
    border-radius: 15px;
    border-style: solid;
    color: rgba(240, 248, 255, 0.753);
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    border-color: #46004075;
    padding-left: 15px;
    padding-right: 15px;
    transition: all 0.25s ease-in-out;
}

#content input:focus {
    outline: none;
    border-color: #46004075;
    border-style: solid;
    border-radius: 7.5px;
}

#content input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px rgb(92, 71, 126) inset !important;
    -webkit-text-fill-color: white !important;
}
</style>