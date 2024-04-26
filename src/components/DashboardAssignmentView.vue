<script>
import HeaderLine from './HeaderLine.vue';

export default {
    name: 'DashboardAssignmentView',
    methods: {
        async reloadAssignment(code) {
            HeaderLine.methods.loadStatus(0);
            const response = await fetch("https://relacexyz.duckdns.org/api/a/getbyid/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jwt: localStorage.getItem("token"),
                    id: code
                }),
            });
            const data = await response.json();

            console.log(data);
            if (data.success) {
                document.getElementById('title').innerText = data.assignment.title;

                document.getElementById('description').innerHTML = data.assignment.description;

                this.deadline = new Date(data.assignment.deadline * 1000);

                this.timeTillDeadlineActualizer = setInterval(() => {
                    const now = new Date();
                    const diff = this.deadline - now;
                    if (diff < 0) {
                        this.timeTillDeadline = 'Deadline passed';
                        clearInterval(this.timeTillDeadlineActualizer);
                    }
                    else {
                        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
                        const milliseconds = Math.floor(diff % 1000);

                        this.timeTillDeadline = days.toString().padStart(2, "0") + "d " + hours.toString().padStart(2, "0") + "h " + minutes.toString().padStart(2, "0") + "m " + seconds.toString().padStart(2, "0") + "s " + milliseconds.toString().padStart(3, "0") + "ms";
                    }
                }, 1);

                const now = new Date();
                const diff = this.deadline - now;
                if (diff < 0) {
                    this.timeTillDeadline = 'Deadline passed';
                    clearInterval(this.timeTillDeadlineActualizer);
                }
                else {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
                    const milliseconds = Math.floor(diff % 1000);

                    this.timeTillDeadline = days.toString().padStart(2, "0") + "d " + hours.toString().padStart(2, "0") + "h " + minutes.toString().padStart(2, "0") + "m " + seconds.toString().padStart(2, "0") + "s " + milliseconds.toString().padStart(3, "0") + "ms";
                }

                console.log(this.timeTillDeadlineActualizer);
            } else {
                alert('An error occurred while loading the assignment: ' + data.message);
            }
            HeaderLine.methods.addLoadStatus(100);
        }
    },
    data: function () {
        return {
            changed: false,
            deadline: '',
            timeTillDeadlineActualizer: 0,
            timeTillDeadline: '',
        }
    },
    mounted: async function () {
        HeaderLine.methods.loadStatus(0);
        await this.reloadAssignment(this.$route.params.id);
    },
    beforeUpdate: async function () {
        if (this.changed) {
            this.changed = false;
            let value = this.timeTillDeadlineActualizer;
            clearInterval(parseInt(value));
            console.log('cleared: ' + value);
            await this.reloadAssignment(this.$route.params.id);
        }
    },
    beforeRouteUpdate: async function (to, from, next) {
        this.changed = true;
        next();
    }
}

</script>

<template>
    <div id="single-assignment-container-dashboard">
        <h2 id="title"></h2>
        <p id="description"></p>
        <p id="deadline">{{ timeTillDeadline }}</p>
    </div>
</template>

<style>
#title {
    margin-top: 20px;
    margin-bottom: 20px;
    color: #ff00ffd7;
}

#single-assignment-container-dashboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 85%;
    height: 45vh;
    background-color: #6b6b6b25;
    border-radius: 25px;
    overflow-y: auto;
    overflow-x: hidden;
}

#single-assignment-container::-webkit-scrollbar {
    display: none;
}
</style>