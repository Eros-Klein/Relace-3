<script>
import HeaderLine from './HeaderLine.vue';
import HomeView from './HomeView.vue';
import NavBar from './NavBar.vue';

export default {
    name: 'HomeView',
    data: function () {
        return {
            count: Number,
            offset: Number
        }
    },
    methods: {
        turnSearchBar() {
            const searchBar = document.getElementById("assignment-search-bar");
            const searchBarContainer = document.getElementById("search-bar-dashboard");
            if (searchBar.style.display !== "block") {
                searchBar.style.display = "block";
                searchBarContainer.style.width = "50%";
            } else {
                searchBarContainer.style.width = "5vh";
                setTimeout(() => {
                    searchBar.style.display = "none";
                }, 250);
            }
        },
        async goToAssignment(code) {
            await this.$router.push('/dashboard/a/' + code);
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
        async insertAssignmentsWithSearch() {
            document.getElementById("assignment-container").innerHTML = "";

            HeaderLine.methods.loadStatus(20);
            const searchBar = document.getElementById("assignment-search-bar");
            const response = await fetch("https://relacexyz.duckdns.org/api/a/get", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jwt: localStorage.getItem("token"),
                    searchParams: searchBar.value,
                    compact: true
                }),
            });
            HeaderLine.methods.loadStatus(30);
            const data = await response.json();
            HeaderLine.methods.loadStatus(50);

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
                if (data.message.toLowerCase().includes('jwt') || data.message.toLowerCase().includes('token') || data.message.toLowerCase().includes('expired')) {
                    NavBar.beforeMount();
                }
                else if (data.message.toLowerCase("found")) {
                    console.log("No assignments found");
                }
                else alert('An error occurred while loading the assignments: ' + data.message);
            }
            HeaderLine.methods.loadStatusSucceed();

        },
        async loadAssignments() {
            HomeView.methods.startLoad();
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

            console.log(data.success);
            HomeView.methods.endLoad();
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
                if (data.message.toLowerCase().includes('jwt') || data.message.toLowerCase().includes('token') || data.message.toLowerCase().includes('expired')) {
                    NavBar.beforeMount();
                }
                else alert('An error occurred while loading the assignments: ' + data.message);
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
            if (element.scrollLeft + element.clientWidth >= element.scrollWidth - 5) {
                this.offset += 30;
                this.insertAssignments();
            }
        })

        const searchBar = document.getElementById("assignment-search-bar");

        searchBar.addEventListener("keyup", () => {
            this.insertAssignmentsWithSearch();
        });
    },
}
</script>

<template>
    <div id="container">
        <div class="dashboard-content" id="assignment-container">

        </div>
        <div id="reload">
            <img src="../assets/images/load.png" id="reload-pic" @click="loadAssignments">
        </div>
        <div id="search-bar-dashboard">
            <img src="../assets/images/search.png" id="search-pic" @click="turnSearchBar">
            <input type="text" id="assignment-search-bar" placeholder="Search...">
        </div>
        <RouterView />
    </div>
</template>

<style>
#assignment-search-bar {
    background-color: #6b6b6b25;
    width: 100%;
    border-radius: 25px;
    padding: 10px;
    border: none;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 12px;
    border-style: solid;
    border-color: #46004075;
    transition: all 0.25s ease-in-out;
    margin-left: 10px;
    display: none;
}

#assignment-search-bar:focus {
    outline: none;
    border-color: #46004075;
    border-style: solid;
    border-radius: 7.5px;
}

#search-bar-dashboard {
    width: 5vh;
    height: 5vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #6b6b6b25;
    border-radius: 25px;
    padding: 10px;
    margin-bottom: 1%;
    margin-top: 1%;
    transition: all 0.25s ease-in-out;
}

#search-pic {
    cursor: pointer;
    width: 35px;
    height: 35px;
}

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

.dashboard-content {
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