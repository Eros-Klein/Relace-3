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
        },
        goToCalendar() {
            this.$router.push('/calendar');
            window.history.pushState(null, '', '/calendar');
        },
        toggleEditor() {
            if (document.getElementById('editor').style.display === 'flex') {
                this.closeEditor();
            }
            else {
                document.getElementById('editor').style.display = 'flex';
            }
        },
        closeEditor() {
            const editor = document.getElementById('editor')
            editor.style.display = 'none';
          for (let child of editor.children) {
             if (child instanceof HTMLInputElement){
                child.value = '';
             }
          }
        },
        async submitAssignment() {
            const title = document.getElementById('a-title').value;
            const description = document.getElementById('a-desc').value;
            const dueDate = new Date(document.getElementById('a-date').value).getTime() / 1000;

            console.log(title);
            console.log(description);
            console.log(dueDate);

            const response = await fetch("https://relacexyz.duckdns.org/api/a/add", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    deadline: dueDate,
                    jwt: localStorage.getItem('token'),
                    attachments: []
                })
            });

            const data = await response.json();

            if (data.success) {
                this.closeEditor();
                window.location.reload();
            }
            else {
                document.getElementById('error-text').innerText = data.message;
            }
            console.log(data);
        },
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
                window.history.pushState(null, '', '/welcome');
            }
            else {
                console.log('refreshed');
                window.location.reload();
            }
        }
    },
    props: {
        selected: String
    },
    mounted: function () {
        document.addEventListener('keydown', (e) => {
            console.log(e);
            console.log(e.ctrlKey);
            console.log(e.altKey);
            console.log(e.key);
            if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'a')) {
                console.log('add');
                this.toggleEditor();
            }
            if (e.key === 'Escape') {
                this.closeEditor();
            }
        });
        document.getElementById('a-desc').addEventListener('input', function () {
            const current = document.getElementById('a-desc').value.length;
            document.getElementById('current').innerText = current;

            if (current > 2000) {
                document.getElementById('current').style.color = 'red';
            }
            else {
                document.getElementById('current').style.color = 'white';
            }
        });
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
            <button id="calendar" @click="goToCalendar()" class="side-bar-element">
                <img src="../assets/images/calendar.png" alt="calendar">
            </button>
            <button class="side-bar-element" @click="goToDashboard()">
                <img src="../assets/images/to-do-list.png" alt="todolist">
            </button>
        </div>
        <div class="side-bar-group">
            <button @click="toggleEditor()" id="add" class="side-bar-element">
                <img src="../assets/images/add.png" alt="add">
            </button>
        </div>
        <!-- 
            <div class="side-bar-group">
            <button class="side-bar-element">
                <img src="../assets/images/group.png" alt="group">
            </button>
            <button class="side-bar-element" @click="goToMessanger()">
                <img src="../assets/images/speech-bubble.png" alt="speech">
            </button>
        </div>
        
        -->
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
    <div id="editor">
        <p id="close" @click="toggleEditor()">✕</p>
        <h1>Add Assignment</h1>
        <input id="a-title" type="text" placeholder="Title">
        <textarea id="a-desc" placeholder="Description..."></textarea>
        <div id="the-count">
            <span id="current">0 </span>
            <span id="maximum">/ 2000</span>
        </div>
        <input id="a-date" type="date" placeholder="Deadline">
        <button @click="submitAssignment()">Add</button>
        <p id="error-text"></p>
    </div>
</template>

<style>
#the-count {
    float: right;
    padding: 0.1rem 0 0 0;
    font-size: 1rem;
    color: white;
}

#error-text {
    color: red;
    font-size: 1.5em;
}

#word-count {
    color: white;
    font-size: 0.1em;
}

#close {
    position: absolute;
    right: 25px;
    top: 10px;
    font-size: 20px;
    color: white;
    cursor: pointer;
}

#editor h1 {
    font-size: 2.5em;
    color: rgb(189, 119, 255);
}



#editor button:hover {
    background-color: rgb(189, 119, 255, 0.8);
}

#editor input {
    width: 90%;
    height: 40px;
    min-height: 40px;
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

#a-desc {
    max-height: 100px;
    max-width: 90%;
    height: 200px;
    width: 90%;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: rgba(180, 180, 180, 0.281);
    border-radius: 15px;
    border-style: solid;
    color: rgba(240, 248, 255, 0.753);
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    border-color: #46004075;
    padding: 15px;
    padding: 15px;

    transition: all 0.25s ease-in-out;
}

#editor button {
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

#editor {
    display: none;
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