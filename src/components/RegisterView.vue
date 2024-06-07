<script lang="ts">
export default {
    name: 'RegisterView',
    methods: {
      stringToHash(string1 : string) {

          let hash = 0;

          if (string1.length === 0) return hash;

          for (let i = 0; i < string1.length; i++) {
              const char = string1.charCodeAt(i);
              hash = ((hash << 5) - hash) + char;
              hash = hash & hash;
          }

          return hash;
      },
      async register() {
            const errorField = document.getElementById('error')!;

            const username = (document.getElementById('username') as HTMLInputElement).value;
            const password = (document.getElementById('password') as HTMLInputElement).value;
            const email = (document.getElementById('email') as HTMLInputElement).value;

            if (username === '' || password === '' || email === '') {
                return errorField.innerText = 'Please fill out all fields';
            }
            else if (password.length < 8) {
                return errorField.innerText = 'Password must be at least 8 characters long';
            }
            // eslint-disable-next-line
            else if (email.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g) === null) {
                return errorField.innerText = 'Please enter a valid email address';
            }
            else if (username.length < 2) {
                return errorField.innerText = 'Username must be at least 2 characters long';
            }
            else if (username.length > 30) {
                return errorField.innerText = 'Username must be at most 30 characters long';
            }
            else {
                const response = await fetch('https://relacexyz.duckdns.org/api/auth/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "username": username,
                        "password": password,
                        "email": email
                    })
                });
                const data = await response.json();
                console.log(data);

                if (data.success) {
                    this.login();
                } else {
                    document.getElementById('error')!.innerText = data.message;
                }
            }
        },
        async login() {
            const username = (document.getElementById('username') as HTMLInputElement).value;
            const password = (document.getElementById('password') as HTMLInputElement).value;

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

            if (data.success) {
                localStorage.setItem('token', data.jwt);
                localStorage.setItem('username', username);
                localStorage.setItem('refresh', data.refeshToken);
                localStorage.setItem('key', this.stringToHash(password.substring(0, 4)).toString());
                
                //@ts-ignore
                this.$router.push('/home');
            } else {
                document.getElementById('error')!.innerText = data.message;
            }
        },
      goToLogin(){
        //@ts-ignore
        this.$router.push('/auth/login');
        window.history.pushState(null, '', '/auth/login');
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
            <h1>Relace - Signup</h1>
            <input @keydown.enter="register" id="username" type="text" placeholder="Username">
            <input @keydown.enter="register" id="password" type="password" placeholder="Password">
            <input @keydown.enter="register" id="email" type="email" placeholder="Email">
            <p id="error"></p>
          <div id="button-container">
            <button @click="register">Register</button>
            <button id="login-button" @click="goToLogin">Login instead</button>
          </div>
        </div>
    </div>
</template>

<style>
#button-container{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 90%;
    width: 90%;
}
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
    font-weight: 600;
    border-color: #46004075;
    padding-left: 15px;
    padding-right: 15px;
}
</style>