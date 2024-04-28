<script>
import SettingView from './SettingView.vue';


export default {
    name: 'NavBar',
    methods: {
        goToHome() {
            this.$router.push('/home');
            window.history.pushState(null, '', '/home');
        },
        goToSetting() {
            this.$router.push('/setting');
            window.history.pushState(null, '', '/setting');
        },
        goToMessanger() {
            this.$router.push('/m');
            window.history.pushState(null, '', '/m');
        },
        goToNewsletter() {
            this.$router.push('/newsletter');
            window.history.pushState(null, '', '/newsletter');
        },
        goToDashboard() {
            this.$router.push('/dashboard');
            window.history.pushState(null, '', '/dashboard');
        }
    },
    beforeMount: async function () {
        const token = localStorage.getItem('token');
        const response = await fetch("https://relacexyz.duckdns.org/api/auth/testauth/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jwt: token
            })
        });
        const data = await response.json();
        console.log(data);

        console.log(data.success);
        if (!data.success) {
            if (!await SettingView.methods.refresh()) {
                console.log('refresh failed');
                this.$router.push('/welcome');
            }
            else {
                console.log('refreshed');
                window.location.reload();
            }
        }
    },
    props: {
        selected: String
    }
}
</script>
<template>
    <div id="side-bar">
        <div class="side-bar-group">
            <button @click="goToNewsletter()" class="side-bar-element">
                <img src="../assets/images/logo.png" alt="logo">
            </button>
        </div>
        <div class="side-bar-group">
            <button id="home" @click="goToHome()" class="side-bar-element">
                <img src="../assets/images/home1.png" alt="home">
            </button>
            <button class="side-bar-element">
                <img src="../assets/images/calendar.png" alt="calendar">
            </button>
            <button class="side-bar-element" @click="goToDashboard">
                <img src="../assets/images/to-do-list.png" alt="todolist">
            </button>
        </div>
        <div class="side-bar-group">
            <button class="side-bar-element">
                <img src="../assets/images/group.png" alt="group">
            </button>
            <button class="side-bar-element" @click="goToMessanger()">
                <img src="../assets/images/speech-bubble.png" alt="speech">
            </button>
        </div>
        <div class="side-bar-group">

        </div>
        <div class="side-bar-group">
            <button class="side-bar-element" @click="goToSetting()">
                <img src="../assets/images/setting.png" alt="setting" id="setting">
            </button>
            <button class="side-bar-element">
                <img id="pfp" src="../assets/images/example-pfp.png" alt="pfp">
            </button>
        </div>
    </div>
</template>

<style>
#side-bar {
    width: 40px;
    height: 100%;
    background-color: #6800886b;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    overflow-x: hidden;
    padding-top: 20px;
    padding-left: 5px;
    padding-right: 5px;
    padding-bottom: 20px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: space-between;
    border-right: black 2.5px solid;
}

.side-bar-element:hover {
    cursor: pointer;
}

.side-bar-element {
    margin-bottom: 20px;
    color: #c480e7;
    font-size: 20px;
    text-align: center;
    transition: ease-in-out 0.4s;
    padding: 0px;
    background-color: transparent;
    border-style: none;
    user-select: none;
}

.side-bar-group {
    flex-flow: column wrap;
}

.side-bar-element:hover {
    transition: all 0.25s ease-in-out;
    transform: scale(1.15);
}

img {
    width: 65%;
    height: 65%;
}

#pfp {
    border-radius: 50%;
    margin-bottom: 10px;
}

#setting:hover {
    transition: all 0.5s ease-in-out;
    rotate: 180deg;
}
</style>