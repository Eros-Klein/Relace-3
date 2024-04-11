<script>
import HeaderLine from './HeaderLine.vue';


export default {
    name: 'HomeView',
    methods: {
        goToAssignment(code) {
            this.$router.push('/assignment/' + code);
        },
        addAssignment(headline, body, id) {
            const assignmentContainer = document.getElementById("assigment-container");
            const assignment = document.createElement("div");
            assignment.classList.add("assignment");
            assignment.addEventListener("click", () => {
                this.goToAssignment(id);
            });
            assignment.innerHTML = `
                <div class="assignment_head">
                    <h2>${headline}</h2>
                </div>
                <div class="line"></div>
                <div class="assignment_body">
                    <p>${body}</p>
                </div>
            `;
            assignmentContainer.appendChild(assignment);
        }
    },
    mounted: function () {
        const nowTime = new Date();
        if (nowTime.getHours() < 12) {
            HeaderLine.methods.setHeadline("Good Morning, " + localStorage.getItem('username') + "!");
        } else if (nowTime.getHours() < 18) {
            HeaderLine.methods.setHeadline("Good Afternoon, " + localStorage.getItem('username') + "!");
        } else {
            HeaderLine.methods.setHeadline("Good Evening, " + localStorage.getItem('username') + "!");
        }

        this.addAssignment("Project", "Finish the Vue.js project by the end of the week.", 1);
        this.addAssignment("Learn Vue", "Learn it.", 2);

    },
}
</script>

<template>
    <div id="container">
        <div class="home-content" id="assigment-container">

        </div>
        <div class="home-content">

        </div>
        <div class="home-content">

        </div>
    </div>
</template>

<style>
.assignment h2 {
    color: #d4d4d4;
    font-size: 20px;

}

.assignment p {
    color: #d4d4d4;
    font-size: 15px;
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
    transition: all 0.25s ease-in-out;
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
    margin-bottom: 3%;
}

#container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>