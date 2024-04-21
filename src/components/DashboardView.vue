<script>
import HeaderLine from './HeaderLine.vue';
import DashBoardAssignmentView from './DashboardAssignmentView.vue';


export default {
    name: 'HomeView',
    data: function () {
        return {
            count: Number,
            offset: Number
        }
    },
    methods: {
        async goToAssignment(code) {
            await this.$router.push('/dashboard/a/' + code);
            await DashBoardAssignmentView.methods.reloadAssignment(this.$route.params.id);
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
            const response = await fetch("https://relacexyz.duckdns.org/api/a/loadmoodle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jwt: localStorage.getItem("token")
                }),
            });
            const data = await response.json();

            console.log(data);
        },
        async insertAssignments() {
            const response = await fetch("https://relacexyz.duckdns.org/api/a/get", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jwt: localStorage.getItem("token"),
                    count: this.count,
                    offset: this.offset,
                    compact: true
                }),
            });
            const data = await response.json();

            console.log(data);

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
                console.log(data.message);
            }
            HeaderLine.methods.addLoadStatus(95);
        }
    },
    mounted: async function () {
        HeaderLine.methods.loadStatus(0);
        const nowTime = new Date();
        if (nowTime.getHours() < 12) {
            HeaderLine.methods.setHeadline("Good Morning, " + localStorage.getItem('username') + "!");
        } else if (nowTime.getHours() < 18) {
            HeaderLine.methods.setHeadline("Good Afternoon, " + localStorage.getItem('username') + "!");
        } else {
            HeaderLine.methods.setHeadline("Good Evening, " + localStorage.getItem('username') + "!");
        }

        HeaderLine.methods.addLoadStatus(5);
        this.count = 30;
        this.offset = 0;
        this.insertAssignments();

        const element = document.getElementById('assignment-container');
        element.addEventListener('scroll', () => {
            console.log(element.scrollLeft, element.scrollWidth);
            console.log(element.scrollLeft + element.clientWidth);
            if (element.scrollLeft + element.clientWidth >= element.scrollWidth - 5) {
                this.offset += 30;
                console.log(this.offset);
                this.insertAssignments();
            }
        })
    },
}
</script>

<template>
    <div id="container">
        <div class="home-content" id="assignment-container">
            <div id="reload">
                <img src="../assets/images/load.png" id="reload-pic" @click="loadAssignments">
            </div>
        </div>
        <RouterView />
    </div>
</template>

<style>
#current-assignment-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #6b6b6b34;
    border-radius: 25px;
}

#fetch:hover {
    background-color: #a500a517;
    color: #88888880;
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
    flex-direction: columns;
    justify-content: space-around;
    width: 15%;
    background-color: #0000004f;
    border-color: #46004075;
    border-style: solid;
    border-radius: 25px;
    margin-right: 20px;
    transition: all 0.25s ease-in-out;
    flex: 0 0 auto;
}

.assignment:hover {
    background-color: #a500a517;
    color: #88888880;
    cursor: pointer;

}

.home-content {
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

.currentassignment-content {
    display: flex;
    flex-direction: row;
    align-items: left;
    width: 85%;
    background-color: #6b6b6b25;
    padding: 20px;
    border-radius: 25px;
    height: 40vh;
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
</style>