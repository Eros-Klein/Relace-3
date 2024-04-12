<script>
import HeaderLine from './HeaderLine.vue';


export default {
    name: 'DashboardView',
    methods: {
        goToAssignment(code) {
            console.log("Going to assignment with code " + code + "...  Not really.");
        },
        addAssignment(headline, body, id) {
            console.log("Adding assignment " + headline + " with id " + id + " and body " + body);
        }
    },
    mounted: function () {
        HeaderLine.methods.setHeadline("Assignments");

        this.addAssignment("Project", "Finish the Vue.js project by the end of the week.", 1);
        this.addAssignment("Learn Vue", "Learn it.", 2);

    },
}
</script>

<template>
    <div id="container">
        <div class="assignment-content">
            <div id="assignment-container">
                <div class="assignment-info">
                    <div class="assignment-head">
                        <p id="name">Project: Relace</p>
                        <p id="deadline">19.4.2024</p>
                        <p id="course">RELACE_3AHIF_23/24</p>
                    </div>
                    <div class="assignment-body">
                        <p id="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima nam ducimus
                            explicabo alias sequi, repellat commodi. Dignissimos, nesciunt asperiores! Iste illo ullam,
                            natus eveniet quae sed beatae qui id non.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.assignment-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 85%;
    height: 75vh;
    background-color: #6b6b6b25;
    border-radius: 25px;
}

#assignment-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 20px;
}

.assignment-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    height: 10%;
    padding: 20px;
    background-color: #0000004f;
    border-color: #46004075;
    border-style: solid;
    border-radius: 25px;
    padding-left: 20px;
    padding-right: 20px;
}

.assignment-head {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 80%;
    padding: 20px;
}

.assignment-body {
    display: none;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 20px;
}
</style>