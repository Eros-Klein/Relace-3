<script>
export default {
    name: 'LoginiView',
    methods: {
        login() {
            login() {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                fetch('https://relacexyz.duckdns.org/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                })
                .then(response => response.json())
                .then(data => {
                    // Save the token in a HTTP Only cookie
                    document.cookie = `token=${data.token}; HttpOnly`;
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        }
    }
}
</script>

<template>
    <div id="container">
        <div class="content">
            <form>
                <input id="username" type="text" placeholder="Username">
                <input id="password" type="password" placeholder="Password">
                <button @click="login">Login</button>
            </form>
        </div>
    </div>
</template>

<style>
.line {
    background-color: #46004075;
    height: 2px;
    width: 100%;
}
.content {
    display: flex;
    flex-direction: row;
    align-items: left;
    width: 85%;
    background-color: #6b6b6b25;
    padding: 20px;
    border-radius: 25px;
    height: 20vh;
    margin-bottom: 3%;
}

#container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>