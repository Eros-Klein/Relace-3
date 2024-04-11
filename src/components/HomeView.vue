<script>
import HeaderLine from './HeaderLine.vue';


export default {
    name: 'HomeView',
    methods: {
        goToAssignment(code) {
            this.$router.push('/assignment/' + code);
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
    },
}
</script>

<template>
    <div id="container">
        <div class="content">
            <div @click="goToAssignment(1)" class="assignment">
                <div class="assignment_head">
                    <h2>Project</h2>
                </div>
                <div class="line"></div>
                <div class="assignment_body">
                    <p>Finish the Vue.js project by the end of the week.</p>
                </div>
            </div>
            <div @click="goToAssignment(1)" class="assignment">
                <div class="assignment_head">
                    <h2>Learn Vue</h2>
                </div>
                <div class="line"></div>
                <div class="assignment_body">
                    <p>Learn it.</p>
                </div>
            </div>
        </div>
        <div class="content">

        </div>
        <div class="content">

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

.content {
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