<script>
import HeaderLine from './HeaderLine.vue';
import HomeView from './HomeView.vue';
import NavBar from './NavBar.vue';

export default {
    name: 'HomeView',
    data: function () {
        return {
            count: Number,
            offset: Number,
            focusedCourse: String
        }
    },
    methods: {
        changeCourseFocus(course, dropdownId) {
            console.log("i was called");
            const dropDownMenu = document.getElementById(dropdownId);
            dropDownMenu.children[0].innerHTML = `<p>${course}</p>`;
            this.focusedCourse = course;
            this.offset = 0;
            this.insertAssignments();

            this.toggleDropdown(dropdownId);
        },
        async insertCourses() {
            const response = await fetch("https://relacexyz.duckdns.org/api/c/get", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jwt: localStorage.getItem("token")
                }),
            });

            const data = await response.json();
            const dropDownMenu = document.getElementById("course-filter");
            const hiddenElementContainer = dropDownMenu.children[1];

            if (data.success) {
                data.courses.forEach((course) => {
                    const divElement = document.createElement("div");
                    divElement.classList.add("hidden-element");
                    divElement.innerHTML = `<p>${course.name}</p>`;
                    divElement.addEventListener("click", () => {
                        this.changeCourseFocus(course.name, "course-filter");
                    });
                    hiddenElementContainer.appendChild(divElement);
                })
            }
        },
        toggleDropdown(dropdownId, pixelHeight) {
            const dropdown = document.getElementById(dropdownId);
            let firstHiddenChild;
            for (let i = 0; i < dropdown.children.length; i++) {
                if (dropdown.children[i].classList.contains("hidden-element-container")) {
                    firstHiddenChild = dropdown.children[i];
                    break;
                }
            }

            if (firstHiddenChild.style.height == pixelHeight) {
                for (let i = 0; i < dropdown.children.length; i++) {
                    if (dropdown.children[i].classList.contains("hidden-element-container")) {
                        dropdown.children[i].style.height = "0px";
                    }
                }
            } else {
                for (let i = 0; i < dropdown.children.length; i++) {
                    if (dropdown.children[i].classList.contains("hidden-element-container")) {
                        dropdown.children[i].style.height = pixelHeight;
                    }
                }
            }
        },
        turnSearchBar() {
            const searchBar = document.getElementById("assignment-search-bar");
            const searchBarContainer = document.getElementById("search-bar-dashboard");
            const dropdownMenu = document.getElementsByClassName("dropdown-menu");
            console.log(dropdownMenu);
            if (searchBar.style.display !== "block") {
                for (let i = 0; i < dropdownMenu.length; i++) {
                    setTimeout(() => dropdownMenu[i].style.display = "block", 175);
                }
                searchBar.style.display = "block";
                searchBarContainer.style.width = "50%";
            } else {
                for (let i = 0; i < dropdownMenu.length; i++) {
                    setTimeout(() => dropdownMenu[i].style.display = "none", 150);
                }
                searchBarContainer.style.width = "5vh";
                setTimeout(() => {
                    searchBar.style.display = "none";
                }, 250);
            }
        },
        async goToAssignment(code) {
            await this.$router.push('/dashboard/a/' + code);
        },
        addAssignment(headline, body, id, done) {
            const assignmentContainer = document.getElementById("assignment-container");
            const assignment = document.createElement("div");
            assignment.classList.add("assignment");
            assignment.addEventListener("click", () => {
                this.goToAssignment(id);
            });
            assignment.innerHTML = `
                <div id="q-${id}" class="quick-menu">
                    <div class="trigger-dropdown-element quick-menu-trigger">
                        <img src='assets/image/dots.png' alt="+">
                    </div>
                    <div class="hidden-element-container">
                        <div class="hidden-element">
                            <p>Delete</p>
                        </div>
                        <div class="hidden-element">
                            <p>Edit</p>
                        </div>
                    </div>
                </div>
                <div class="assignment_head">
                    <h2>${headline}</h2>
                </div>
                <div class="assignment_body">
                    <p>${body}</p>
                </div>
            `;
            assignment.classList.add(done?'done':'not-done')
            assignmentContainer.appendChild(assignment);

          for (let child of document.getElementById(`q-${id}`).children) {
              if (child.classList.contains('trigger-dropdown-element')){
                child.addEventListener('click', () => {
                  console.log('clicked');
                  this.toggleDropdown(`q-${id}`, 500);
                })
              }
          }
        },
        async loadAssignments() {
            HomeView.methods.startLoad();
            console.log(localStorage.getItem('key'));
            const response = await fetch("https://relacexyz.duckdns.org/api/a/loadmoodle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jwt: localStorage.getItem("token"),
                    key: localStorage.getItem('key')
                }),
            });
            const data = await response.json();

            console.log(data.success);
            HomeView.methods.endLoad();

            this.insertAssignments();
        },
        async insertAssignments() {
            const element = document.getElementById('assignment-container');

            const searchBar = document.getElementById("assignment-search-bar");
            const response = await fetch("https://relacexyz.duckdns.org/api/a/get", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jwt: localStorage.getItem("token"),
                    count: this.count,
                    offset: this.offset,
                    compact: true,
                    course: this.focusedCourse === "none" ? undefined : this.focusedCourse,
                    searchParams: searchBar.value
                }),
            });
            const data = await response.json();

            console.log(data);

            if (data.success) {
                element.innerHTML = "";
                for (let i = 0; i < data.assignments.length; i++) {
                    let title = data.assignments[i].title;
                    if (title.length > 35) {
                        title = title.slice(0, 35) + "...";
                    }
                    if (data.assignments[i].deadline == 0) {
                        this.addAssignment(title, "No Deadline", data.assignments[i].id);
                    }
                    else {
                        const date = new Date(data.assignments[i].deadline * 1000);
                        this.addAssignment(title, `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`, data.assignments[i].id, data.assignments[i].done);
                    }

                }
            } else {
                element.innerHTML = `<div id="no_assignments_found">
                        <p id="emoji">:-(</p>
                        <p id="error-message-text">Oh No, Looks Like We Could Not Find What You Were Searching For</p>
                        <p></p>
                    </div>`;
                if (data.message.toLowerCase().includes('jwt') || data.message.toLowerCase().includes('token') || data.message.toLowerCase().includes('expired')) {
                    NavBar.beforeMount();
                }
                else if (data.message.toLowerCase().includes('no assignments found')) {
                    console.log('No assignments found');
                }
                else alert('An error occurred while loading the assignments: ' + data.message);
            }
            HeaderLine.methods.loadStatusSucceed();
        },
        async appendAssignments() {
            const response = await fetch("https://relacexyz.duckdns.org/api/a/get", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jwt: localStorage.getItem("token"),
                    count: this.count,
                    offset: this.offset,
                    compact: true,
                    course: this.focusedCourse === "none" ? undefined : this.focusedCourse
                }),
            });

            const data = await response.json();
            if (data.success) {
                for (let i = 0; i < data.assignments.length; i++) {
                    let title = data.assignments[i].title;
                    if (title.length > 35) {
                        title = title.slice(0, 35) + "...";
                    }
                    const date = new Date(data.assignments[i].deadline * 1000);

                    this.addAssignment(title, `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`, data.assignments[i].id, data.assignments[i].done);
                }
            } else {
                if (data.message.toLowerCase().includes('jwt') || data.message.toLowerCase().includes('token') || data.message.toLowerCase().includes('expired')) {
                    NavBar.beforeMount();
                }
                else if (data.message.toLowerCase().includes('no assignments found')) {
                    console.log('No assignments found');
                }
                else alert('An error occurred while loading the assignments: ' + data.message);
            }
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

        this.focusedCourse = "none";
        await this.insertCourses();

        const element = document.getElementById('assignment-container');
        element.addEventListener('scroll', () => {
            if (element.scrollLeft + element.clientWidth >= element.scrollWidth - 5) {
                this.offset += 30;
                this.appendAssignments();
            }
        });

        const searchBar = document.getElementById("assignment-search-bar");

        searchBar.addEventListener("keyup", () => {
            this.offset = 0;
            this.insertAssignments();
        });

        window.addEventListener("click", (event) => {
            const dropdown = document.getElementsByClassName("dropdown-menu");
            for (let i = 0; i < dropdown.length; i++) {
                if (dropdown[i].children[1].style.height !== "0px" && !dropdown[i].contains(event.target)) {
                    console.log(dropdown[i].children[1]);
                    dropdown[i].children[1].style.height = "0px";
                }
            }
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
            <div class="dropdown-menu" id="course-filter">
                <div class="trigger-dropdown-element" @click="toggleDropdown('course-filter', '250px')">
                    <p>Select Course...</p>
                </div>
                <div class="hidden-element-container">
                    <div class="hidden-element" @click="changeCourseFocus('none', 'course-filter')">
                        <p>none</p>
                    </div>
                </div>
            </div>
        </div>
        <RouterView />
    </div>
</template>

<style>
.quick-menu-trigger{
  width: 2vh;
  padding: 2px;
}

.quick-menu{
  position: absolute;
  width: 5vh;
  height: 5vh;
  right: 0;
  bottom: 1vh;
  border-radius: 100%;
}

.done{
  border-color: #710076a3;
}

.done:hover{
  background-color: rgba(161, 0, 174, 0.69);
}

.not-done{
  border-color: #330b78d9;
}

.not-done:hover{
  background-color: #a500a517;
}

#emoji {
    font-size: 5vh;
}

#error-message-text {
    font-size: 2vh;
}

#no_assignments_found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    user-select: none;
}

.hidden-element-container {
    transition: all 0.25s ease-in-out;
    z-index: 3;
    display: block;
    position: absolute;
    height: 0px;
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    border-radius: 15px;
    scrollbar-color: #46004075 #6b6b6b25;
}

.trigger-dropdown-element p {
    user-select: none;
    padding: 10px;
}

.hidden-element {
    padding: 5px;
  transition: all 0.25s ease-in-out;
    background-color: #160052ef;
    cursor: pointer;
    user-select: none;
}

.hidden-element:hover {
    background-color: #372666ef;
}

.trigger-dropdown-element {
    font-size: 12px;
    border-radius: 25px;
    margin-top: 1%;
    margin-bottom: 1%;
    transition: all 0.25s ease-in-out;
    background-color: #6b6b6b25;
}

.trigger-dropdown-element:hover {
    background-color: #a500a517;
    cursor: pointer;
}

.dropdown-menu {
    top: 0;
    width: 50%;
    display: none;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 25px;
    padding: 10px;
    border: none;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 12px;
    transition: all 0.25s ease-in-out;
    margin-left: 10px;
}

#course-filter {
    display: none;
}

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
    user-select: none;
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
  position: relative;
    flex-direction: column;
    justify-content: space-between;
    align-content: center;
    align-items: center;  
    width: 15%;
    height: 80%;
    background-color: #0000004f;
    border-style: solid;
    border-radius: 25px;
    margin-right: 20px;
    transition: all 0.25s ease-in-out;
    flex: 0 0 auto;
}

.assignment:hover {
    color: #88888880;
    cursor: pointer;

}

.dashboard-content {
    scrollbar-color: #46004075 #6b6b6b25;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
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
    align-items: flex-start;
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

.assignment-header{
  max-width: 300px;
}

#container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>