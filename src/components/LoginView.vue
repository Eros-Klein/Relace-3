<script>


export default {
    name: 'LoginView',
    methods: {
        async login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

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
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', username);
                this.$router.push('/home');
            } else {
                document.getElementById('error').innerText = data.message;
            }
        }
    },
    beforeUnmount: async function () {
        document.getElementById('side-bar').style.display = 'flex';
        document.getElementById('headline-container').style.display = 'flex';
    }
}
</script>

<template>
    <div id="welcome-container">
        <div id="content">
            <h1>Relace - Login</h1>
            <input id="username" type="text" placeholder="Username">
            <input id="password" type="password" placeholder="Password">
            <p id="error"></p>
            <button @click="login">Login</button>
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
}
</style>