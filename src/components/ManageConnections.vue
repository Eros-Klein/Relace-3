<script>
import HeaderLine from './HeaderLine.vue';
import CryptoJS from "crypto-js";
import MicrosoftView from './MicrosoftView.vue';



export default {
    name: 'ManageConnections',
    methods: {
      loginGithub() {
        window.location.href = 'https://github.com/login/oauth/authorize?client_id=Iv1.000062edb18edd6d&redirect_uri=https://www.relacexyz.duckdns.org/git';
        //'https://github.com/login/oauth/authorize?client_id=a36482c8fbd0046dcc09&redirect_uri=https://www.relacexyz.duckdns.org/git';
      },
      loginGithubClose() {
        document.getElementById('github-info').style.display = 'none';
        const connections = document.getElementsByClassName('connection');
        for (let i = 0; i < connections.length; i++) {
          connections[i].style.pointerEvents = 'all';
        }
      },
      loginGithubTrigger() {
        document.getElementById('github-info').style.display = 'flex';
        const connections = document.getElementsByClassName('connection');
        for (let i = 0; i < connections.length; i++) {
          connections[i].style.pointerEvents = 'none';
        }
      },
      loginMoodleTrigger() {
        document.getElementById('info').style.display = 'flex';
        const connections = document.getElementsByClassName('connection');
        for (let i = 0; i < connections.length; i++) {
          connections[i].style.pointerEvents = 'none';
        }
      },
      loginMoodleClose() {
        document.getElementById('info').style.display = 'none';
        const connections = document.getElementsByClassName('connection');
        for (let i = 0; i < connections.length; i++) {
          connections[i].style.pointerEvents = 'all';
        }
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
              jwt: localStorage.getItem('token'),
              key: localStorage.getItem('key')
            })
          })
          const data1 = await response.json();
          if (data1.success) {
            document.getElementById('info').style.display = 'none';
            this.checkForConnections();

          } else {
            document.getElementById('error').innerText = 'An error occurred while connecting to Moodle: ' + data.message;
          }
        }
      },
      async checkForConnections() {
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
            connectedField.innerHTML = '✔️';
          } else {
            connectedField.style.color = '#ff0000';
            connectedField.innerHTML = '❌';
          }
        }
        HeaderLine.methods.loadStatusSucceed();
      },
      //Microsoft GraphAPI
      async loginMicrosoft() {
        await this.authorize();
      },
      async authorize() {
        const clientId = process.env.VUE_APP_CLIENT_ID;
        const redirectUri = process.env.VUE_APP_REDIRECT_URI;
        const scope = 'https://graph.microsoft.com/.default';


        const codeChallenge = MicrosoftView.methods.getCodeChallenge();
        const codeVerifier = MicrosoftView.methods.getCodeVerifier();
        console.log('codeChallenge:', codeChallenge);
        console.log('codeVerifier:', codeVerifier);
        localStorage.setItem('codeVerifier', codeVerifier);

        window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
      },
      generateCodeChallenge() {
        const rand = new Uint8Array(32);
        crypto.getRandomValues(rand);
        const codeVerifier = this.base64URL(new CryptoJS.lib.WordArray.init(rand));
        const codeChallenge = this.base64URL(CryptoJS.SHA256(codeVerifier));

        return {codeChallenge, codeVerifier};
      },
      base64URL(string) {
        return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
      },
    },
    mounted:
        function () {
            console.log("Hello")
            HeaderLine.methods.loadStatus(5);
            this.checkForConnections();
            console.log("Hello");
        }
}
</script>

<template>
    <div id="connection-container">
        <div id="con-content">
            <div class="connection" @click="loginGithubTrigger">
                <p id="name">Github</p>
                <p id="connected">-</p>
            </div>
            <div class="connection" @click="loginMoodleTrigger">
                <p id="name">Moodle</p>
                <p id="connected">-</p>
            </div>
            <div class="connection" @click="loginMicrosoft">
                <p id="name">Teams</p>
                <p id="connected">-</p>
            </div>
        </div>

    </div>
    <div id="info">
        <p id="close" @click="loginMoodleClose">✕</p>
        <h1>Moodle - Login</h1>
        <input id="organization" type="text"
            placeholder="Organization (e.g: https://edufs.edu.htl-leonding.ac.at/moodle/)">
            <input @keydown.enter="loginMoodle" id="username" type="text" placeholder="Username">
        <input @keydown.enter="loginMoodle" id="password" type="password" placeholder="Password">
        <p id="error"></p>
        <button @click="loginMoodle">Login</button>
    </div>

    <div id="github-info">
        <p id="close" @click="loginGithubClose">✕</p>
        <h1>Github - Login</h1>
        <p>Before you continue you have to disable your cors temporarily: <a
                href="https://cors-anywhere.herokuapp.com/corsdemo">Here</a></p>
        <button @click="loginGithub">I have done so!</button>
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

#github-info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: auto;

    box-shadow: 0 0 0 999999px rgba(0, 0, 0, .5);
    border-radius: 25px;

    z-index: 2;
    width: 40%;
    height: 45%;
    padding: 50px;
    border-radius: 25px;
    border-style: solid;
    border-color: #46004075;
    background-color: #5c067ef5;
    display: none;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    align-items: center;
}

#github-info h1 {
    font-size: 2.5em;
    color: rgb(189, 119, 255);
}

#github-info p {
    margin-top: 15px;
    margin-bottom: 15px;
    font-size: 20px;
}

#github-info a {
    color: rgb(189, 119, 255);
}

#github-info button {
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
    border-color: #46004075;
    border-style: solid;
}

#github-info button:hover {
    background-color: rgb(189, 119, 255, 0.8);
}

#info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: auto;

    box-shadow: 0 0 0 999999px rgba(0, 0, 0, .5);
    border-radius: 25px;

    z-index: 2;
    width: 40%;
    height: 45%;
    padding: 50px;
    border-radius: 25px;
    border-style: solid;
    border-color: #46004075;
    background-color: #5c067ef5;
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
    border-color: #46004075;
    border-style: solid;
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

    transition: all 0.25s ease-in-out;
}

#info input:focus {
    outline: none;
    border-color: #46004075;
    border-style: solid;
    border-radius: 7.5px;
}

#info button:hover {
    background-color: rgb(189, 119, 255, 0.8);
}

.connection {
    user-select: none;
    margin-top: 2.5%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 15px;
    background-color: rgba(139, 139, 139, 0.281);
    width: 80%;
    height: 100px;
    cursor: pointer;
    transition: all 0.25s ease-in-out;
    border-style: solid;
    border-color: #46004075;
}

.connection:hover {
    background-color: rgba(180, 180, 180, 0.5);
}

.connection #name {
    font-size: 25px;
}

.connection #connected {
    color: #d4d4d4;
    font-size: 50px;
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
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
}
</style>