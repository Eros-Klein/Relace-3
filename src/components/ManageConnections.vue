<script>
export default {
    name: 'ManageConnections',
    methods: {
        loginGithub() {
            
        },
    },
    mounted:
        function () {
            if (localStorage.getItem('github') === 'true') {
                document.getElementById('connected').innerHTML = 'Connected';
            } else {
                document.getElementById('connected').innerHTML = 'Not Connected';
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
                <button @click="loginGithub">Connect</button>
            </div>
        </div>
    </div>
</template>

<style>
.connection {
    border-radius: 15px;
    background-color: rgba(180, 180, 180, 0.281);
    width: 15%;
    padding-top: 25px;
    padding-bottom: 25px;
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
    width: 77.5%;
    height: 100%;
    margin-left: 392.5px;
    background-color: rgba(150, 150, 150, 0.178);
    padding: 20px;
}
</style>