<script>
import HeaderLine from './HeaderLine.vue';


export default {
    name: 'SettingView',
    methods: {
        extendCategorie(id) {
            const categorie = document.getElementById(id);
            const childs = categorie.children;
            for (let i = 1; i < childs.length; i++) {
                if (childs[i].classList.contains("setting-categorie-hidden") && (childs[i].style.display === "none" || childs[i].style.display === "")) {
                    childs[i].style.display = "flex";
                } else {
                    childs[i].style.display = "none";
                }
            }
        },
        selectConnectionSetting() {
            this.$router.push('/setting/connections');
            window.history.pushState(null, '', '/setting/connections');
        },
        async logout() {
            await fetch("https://relacexyz.duckdns.org/api/auth/logout/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jwt: localStorage.getItem("refresh")
                }),
            });

            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('refresh');
            this.$router.push('/welcome');
        },
        async refresh() {
            const response = await fetch("https://relacexyz.duckdns.org/api/auth/refresh/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jwt: localStorage.getItem("refresh")
                }),
            });
            const data = await response.json();
            console.log(data);
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('refresh', data.refreshToken);
                return true;
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('refresh');

                if (this.$route) {
                    this.$router.push('/welcome');
                }
                else return false;
            }
        }
    },
    beforeMount: function () {
        document.getElementById("headline-container").style.display = "none";
    },
    mounted: function () {
        HeaderLine.methods.loadStatusSucceed();
    },
    beforeUnmount: function () {
        document.getElementById("headline-container").style.display = "flex";
    }
}
</script>

<template>
    <div id="nav-bar-setting">
        <h2>Settings</h2>
        <div id="profile" class="setting-categorie">
            <div class="setting-categorie-trigger" @click="extendCategorie('profile')">
                <p>Profile</p>
            </div>
            <div class="setting-categorie-hidden">
                <p>Edit Profile</p>
            </div>
            <div class="setting-categorie-hidden">
                <p>Manage Visibility</p>
            </div>
            <div class="setting-categorie-hidden" @click="selectConnectionSetting">
                <p>Manage Connections</p>
            </div>
        </div>
        <div id="account" class="setting-categorie">
            <div class="setting-categorie-trigger" @click="extendCategorie('account')">
                <p>Account</p>
            </div>
            <div class="setting-categorie-hidden">
                <p>Personal Information</p>
            </div>
            <div class="setting-categorie-hidden">
                <p>Manage Account</p>
            </div>
            <div class="setting-categorie-hidden">
                <p>Security</p>
            </div>
            <div @click="logout" class="setting-categorie-hidden" id="logout">
                <p>Logout</p>
            </div>
            <div @click="refresh" class="setting-categorie-hidden">
                <p>Refresh</p>
            </div>
        </div>
        <div id="design" class="setting-categorie">
            <div class="setting-categorie-trigger" @click="extendCategorie('design')">
                <p>Design</p>
            </div>
            <div class="setting-categorie-hidden">
                <p>Manage Themes</p>
            </div>
            <div class="setting-categorie-hidden">
                <p>Advanced</p>
            </div>
        </div>
    </div>
    <RouterView />
</template>

<style>
#logout {
    background-color: #83000098;
}

.setting-categorie-hidden {
    width: 80%;
    height: 35px;
    background-color: #6800886b;
    text-align: center;
    justify-content: center;
    font-size: 10px;
    color: #838383;
    margin-top: 15px;
    transition: all 0.25s ease-in-out;
    border-radius: 25px;
    display: none;
    align-items: center;
}

.setting-categorie-hidden:hover {
    background-color: #a500a517;
    cursor: pointer;
    transition: all 0.25s ease-in-out;

    p {
        color: #88888880;
    }
}

.setting-categorie-hidden p {

    font-size: 15px;
    text-align: center;
    justify-self: center;
    transition: all 0.25s ease-in-out;
    user-select: none;
}

.setting-categorie-trigger {
    width: 100%;
    height: 50px;
    background-color: #6800886b;
    border: none;
    border-bottom: 1px solid #46004075;
    text-align: center;
    justify-content: center;
    font-size: 20px;
    color: #838383;
    transition: all 0.25s ease-in-out;
    border-radius: 25px;
    display: flex;
    align-items: center;
}

.setting-categorie {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 90%;
    margin-bottom: 25px;
}

.setting-categorie-trigger:hover {
    background-color: #a500a517;
    color: #88888880;
    cursor: pointer;
    transition: all 0.25s ease-in-out;

    p {
        color: #88888880;
    }
}

#nav-bar-setting {
    align-items: center;
    width: 40px;
    height: 100%;
    background-color: #6800886b;
    position: fixed;
    top: 0;
    left: 0;
    width: 350px;
    margin-left: 50px;
    z-index: 1;
    overflow-x: hidden;
    padding-top: 20px;
    padding-bottom: 20px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-content: center;
    border-right: black 2.5px solid;
}

#nav-bar-setting h2 {
    color: #d4d4d4;
    font-size: 20px;
    text-align: center;
    margin-bottom: 20px;
}

.setting-categorie-trigger p {
    color: #8d8d8d;
    font-size: 20px;
    text-align: center;
    margin-bottom: 20px;
    justify-self: center;
    transition: all 0.25s ease-in-out;
    user-select: none;
}
</style>