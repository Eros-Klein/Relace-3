<script>
import HeaderLine from './HeaderLine.vue';

export default {
    name: 'AssignmentView',
    mounted: async function () {
        HeaderLine.methods.loadStatus(0);
        console.log(this.$route.params.id);
        const response = await fetch("https://relacexyz.duckdns.org/api/a/getbyid/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jwt: localStorage.getItem("token"),
                id: this.$route.params.id
            }),
        });
        HeaderLine.methods.loadStatus(30);
        const data = await response.json();

        console.log(data);
        if (data.success) {
            HeaderLine.methods.setHeadline(data.assignment.course);

            document.getElementById('title').innerText = data.assignment.title;

            document.getElementById('description').innerText = data.assignment.description;

            const date = new Date(data.assignment.deadline * 1000);
            document.getElementById('deadline').innerText = 'Deadline: ' + date.getDate().toString().padStart(2, "0") + '.' + (date.getMonth() + 1).toString().padStart(2, "0") + '.' + date.getFullYear() + ' ' + date.getHours().toString().padStart(2, "0") + ':' + date.getMinutes().toString().padStart(2, "0") + ':' + date.getSeconds().toString().padStart(2, "0");
        } else {
            alert('An error occurred while loading the assignment: ' + data.message);
        }
        HeaderLine.methods.loadStatusSucceed();
    }
}

</script>

<template>
    <center>
        <div id="single-assignment-container">
            <h2 id="title"></h2>
            <p id="description"></p>
            <p id="deadline"></p>
            <p id="done"></p>
        </div>
    </center>

</template>

<style>
#title {
    margin-top: 20px;
    margin-bottom: 20px;
    color: #ff00ffd7;
}

#single-assignment-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 85%;
    height: 75vh;
    background-color: #6b6b6b25;
    border-radius: 25px;
}
</style>