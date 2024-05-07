<script>
import HeaderLine from './HeaderLine.vue';
import NavBar from './NavBar.vue';


export default {
    name: 'HomeView',
    methods: {
        goToAssignment(code) {
            this.$router.push('/a/' + code);
        },
        startLoad() {
            const reloadPic = document.getElementById("reload-pic");
            reloadPic.style.animation = "rotation 1.5s infinite linear";
        },
        endLoad() {
            const reloadPic = document.getElementById("reload-pic");
            reloadPic.style.animation = "";
        },
        async getAssignments() {
            this.startLoad();
            const response = await fetch("https://relacexyz.duckdns.org/api/a/get", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jwt: localStorage.getItem("token"),
                    count: 30,
                    compact: true
                }),
            });
            const data = await response.json();
            console.log(data);
            this.endLoad();
            if (data.success) {

                for (let i = 0; i < data.assignments.length; i++) {
                    let title = data.assignments[i].title;
                    if (title.length > 35) {
                        title = title.slice(0, 35) + "...";
                    }
                    const date = new Date(data.assignments[i].deadline * 1000);

                    this.addAssignment(title, `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`, data.assignments[i].id);
                }
            } else {
                if (data.message.toLowerCase().includes('jwt') || data.message.toLowerCase().includes('expired')) {
                    NavBar.beforeMount();
                }
                else alert('An error occurred while loading the assignments: ' + data.message);
            }

            HeaderLine.methods.loadStatus(100);
            HeaderLine.methods.loadStatusSucceed();
        },
        addAssignment(headline, body, id) {
            const assignmentContainer = document.getElementById("assignment-container");
            const assignment = document.createElement("div");
            assignment.classList.add("assignment");
            assignment.addEventListener("click", () => {
                this.goToAssignment(id);
            });
            assignment.innerHTML = `
                <div class="assignment_head">
                    <h2>${headline}</h2>
                </div>
                <div class="assignment_body">
                    <p>${body}</p>
                </div>
            `;
            assignmentContainer.appendChild(assignment);
        },
        async loadAssignments() {
            this.startLoad();
            const response = await fetch("https://relacexyz.duckdns.org/api/a/loadmoodle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jwt: localStorage.getItem("token"),
                    key: localStorage.getItem("key")
                }),
            });
            const data = await response.json();
            this.endLoad();
            if (data.success) {
                this.getAssignments();
            }
            else {
                if (data.message.includes('jwt') || data.message.includes('token') || data.message.includes('expired')) {
                    NavBar.beforeMount();
                }
                else alert('An error occurred while loading the assignments: ' + data.message);
            }
            console.log(data);
        }
    },
    beforeMount: function () {
        HeaderLine.methods.loadStatus(20);
    },
    mounted: async function () {
        HeaderLine.methods.loadStatus(0);
        const nowTime = new Date();
        if (nowTime.getHours() < 12 && nowTime.getHours() >= 4) {
            HeaderLine.methods.setHeadline("Good Morning, " + localStorage.getItem('username') + "!");
        } else if (nowTime.getHours() < 18) {
            HeaderLine.methods.setHeadline("Good Afternoon, " + localStorage.getItem('username') + "!");
        } else {
            HeaderLine.methods.setHeadline("Good Evening, " + localStorage.getItem('username') + "!");
        }
        HeaderLine.methods.loadStatus(5);
        this.getAssignments();
    }
}
</script>

<template>
    <div id="container">
        <div class="home-content">
            <div id="assignment-container">

            </div>
            <div id="reload">
                <img src="../assets/images/load.png" id="reload-pic" @click="loadAssignments">
            </div>
        </div>
        <div class="home-content">
        </div>
        <div class="home-content">

        </div>
    </div>
</template>

<style>
@keyframes rotation {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(359deg);
    }
}

#reload-pic {
    width: 50px;
    height: 50px;
    cursor: pointer;
    user-select: none;
}

#reload {
    position: fixed;
    bottom: 20px;
    right: 20px;
    cursor: pointer;
}

#fetch {
    width: 100%;
    height: 100%;
    background-color: #0000004f;
    border-color: #46004075;
    border-style: solid;
    border-radius: 25px;
    color: #d4d4d4;
    font-size: 20px;
    transition: all 0.25s ease-in-out;
    cursor: pointer;
}

#fetch:hover {
    background-color: #a500a517;
    color: #88888880;
}

.assignment h2 {
    color: #d4d4d4;
    font-size: 2vh;

}

.assignment p {
    color: #d4d4d4;
    font-size: 1.6vh;
}

.line {
    background-color: #46004075;
    height: 2px;
    width: 100%;
}

.assignment {
    padding: 20px;
    user-select: none;
    display: flex;
    flex-direction: column;
    align-items: left;
    width: 15%;
    background-color: #0000004f;
    border-color: #46004075;
    border-style: solid;
    border-radius: 25px;
    margin-right: 20px;
    margin-left: 20px;
    transition: all 0.25s ease-in-out;
    flex: 0 0 auto;
}

.assignment:hover {
    background-color: #a500a517;
    color: #88888880;
    cursor: pointer;

}

.home-content {
    scrollbar-color: #46004075 #6b6b6b25;
    display: flex;
    flex-direction: row;
    align-items: left;
    width: 85%;
    background-color: #6b6b6b25;
    padding: 20px;
    border-radius: 25px;
    height: 20vh;
    flex-wrap: nowrap;
    margin-bottom: 3%;
    overflow-x: auto;
    overflow-y: hidden;
}

.home-content::-webkit-scrollbar {
    display: inline;
    background-color: #6b6b6b25;
    border-radius: 25px;
    height: 15px;
}

#container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

#assignment-container {
    display: flex;
    flex-direction: row;
    align-items: left;
    width: 90%;
}
</style>