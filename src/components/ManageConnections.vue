<script>
export default {
    name: 'ManageConnections',
    methods: {
        loginGithub() {
            window.location.href = 'https://github.com/login/oauth/authorize?client_id=Iv1.000062edb18edd6d&redirect_uri=https://www.relacexyz.duckdns.org/git';
        },
    },
    mounted:
        function () {
            const connectedField = document.getElementById('connected');
            if (localStorage.getItem('github') != null) {
                connectedField.style.color = '#00ff00';
                connectedField.innerHTML = 'Connected';
            } else {
                connectedField.style.color = '#ff0000';
            }
        }
}
</script>

<template>
    <div id="connection-container">
        <div id="content">
            <div class="connection">
                <p id="name">Github</p>
                <p id="connected"></p>
                <button id="login" @click="loginGithub">Connect</button>
            </div>
        </div>
    </div>
</template>

<style>
.connection {
    border-radius: 15px;
    background-color: rgba(180, 180, 180, 0.281);
    width: 200px;
    padding-bottom: 25px;
}

.connection #login {
    border-radius: 15px;
    background-color: #e45fff67;
    height: 30px;
    width: 100px;
}

.connection #name {
    font-size: 25px;
}

.connection #connected {
    color: #d4d4d4;
    font-size: 15px;
}

#connection-container {
    align-items: center;
    height: 100%;
    margin-left: 392.5px;
    background-color: rgba(150, 150, 150, 0.178);
    padding: 20px;
}

#content {
    display: flex;
    justify-content: center;
}
</style>