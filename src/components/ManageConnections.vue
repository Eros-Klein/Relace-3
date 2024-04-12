<script>
export default {
    name: 'ManageConnections',
    methods: {
        loginGithub() {
            window.location.href = 'https://github.com/login/oauth/authorize?client_id=Iv1.000062edb18edd6d&redirect_uri=https://www.relacexyz.duckdns.org/git';
        },
        loginMoodleTrigger() {
            document.getElementById('info').style.display = 'flex';
        },
        loginMoodleClose() {
            document.getElementById('info').style.display = 'none';
        },
        async loginMoodle() {
            let organization = document.getElementById('organization').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (!organization.endsWith("/")) {
                organization += "/";
            }
            const response = await fetch(organization + "login/token.php?username=" + username + "&password=" + password + "&service=moodle_mobile_app");
            const data = await response.json();
            console.log(data);
            console.log(data.token);
            if (data.token) {
                const response = await fetch('https://relacexyz.duckdns.org/api/auth/tpapi/settoken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        api: 'moodle',
                        token: data.token,
                        jwt: localStorage.getItem('token')
                    })
                })
                const data1 = await response.json();
                if (data1.success) {
                    document.getElementById('info').style.display = 'none';
                } else {
                    document.getElementById('error').innerText = 'An error occurred while connecting to Moodle: ' + data.message;
                }
            }
        }
    },
    mounted:
        async function () {
            const token = localStorage.getItem('token');
            const connections = document.getElementsByClassName('connection');
            for (let i = 0; i < connections.length; i++) {
                const connectedField = connections[i].children[1];
                const name = connections[i].children[0].innerHTML.toLowerCase();
                const response = await fetch('https://relacexyz.duckdns.org/api/auth/tpapi/hastoken', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jwt: token,
                        api: name
                    })
                })
                const data = await response.json();
                console.log(name);
                console.log(data);

                if (data.success) {
                    connectedField.style.color = '#00ff00';
                    connectedField.innerHTML = 'Connected';
                } else {
                    connectedField.style.color = '#ff0000';
                    connectedField.innerHTML = 'Not Connected';
                }
            }
        }
}
</script>

<template>
    <div id="connection-container">
        <div id="con-content">
            <div class="connection">
                <p id="name">Github</p>
                <p id="connected"></p>
                <button id="login" @click="loginGithub">Connect</button>
            </div>
            <div class="connection">
                <p id="name">Moodle</p>
                <p id="connected"></p>
                <button id="login" @click="loginMoodleTrigger">Connect</button>
            </div>
        </div>
        <div id="info">
            <p id="close" @click="loginMoodleClose">X</p>
            <h1>Moodle - Login</h1>
            <input id="organization" type="text"
                placeholder="Organization (e.g: https://edufs.edu.htl-leonding.ac.at/moodle/)">
            <input id="username" type="text" placeholder="Username">
            <input id="password" type="password" placeholder="Password">
            <p id="error"></p>
            <button @click="loginMoodle">Login</button>
        </div>
    </div>
</template>

<style>
#close {
    position: absolute;
    right: 25px;
    top: 10px;
    font-size: 20px;
    color: white;
    cursor: pointer;

}

#info {
    position: fixed;
    left: 50%;
    transform: translate(-50%, -50px);
    box-shadow: 0 0 0 999999px rgba(0, 0, 0, .5);
    border-radius: 25px;

    z-index: 2;
    width: 40%;
    height: 45%;
    padding: 50px;
    border-radius: 25px;
    background-color: #5c067edc;
    display: none;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    align-items: center;
}

#info h1 {
    font-size: 2.5em;
    color: rgb(189, 119, 255);
}

#info p {
    margin-top: 15px;
    margin-bottom: 15px;
    font-size: 20px;
}

#info button {
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 10px;
    font-size: 20px;
    background-color: rgb(189, 119, 255);
    color: white;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    width: 25%;
    transition: background-color 0.3s;
}

#info input {
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

#info button:hover {
    background-color: rgb(189, 119, 255, 0.8);
}

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

#con-content {
    margin-top: 50px;
    display: flex;
    justify-content: space-evenly;

}
</style>