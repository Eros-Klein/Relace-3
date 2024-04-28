<script>
import HeaderLine from './HeaderLine.vue';
import NavBar from './NavBar.vue';

export default {
    name: 'DashboardAssignmentView',
    methods: {
        async reloadAssignment(code) {
            HeaderLine.methods.loadStatus(30);
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

                const link = document.getElementById('assignment-link');

                console.log(data.assignment.linkToProvider);
                link.addEventListener('click', () => {
                    window.open(data.assignment.linkToProvider, '_blank');
                });

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
                if (data.message.toLowerCase().includes('jwt') || data.message.toLowerCase().includes('token') || data.message.toLowerCase().includes('expired')) {
                    NavBar.beforeMount();
                }
                else alert('An error occurred while loading the assignment: ' + data.message);
            }
            HeaderLine.methods.addLoadStatus(70);
        }
    },
    data: function () {
        return {
            changed: false,
            deadline: new Date(Date.now()),
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
        <div id="assignment-content-dashboard">
            <h2 id="title"></h2>
            <p id="description"></p>
            <button id="assignment-link"> Go To Assignment</button>
        </div>
        <div id="time-container">
            <p id="timecounter">{{ timeTillDeadline }}</p>
            <p id="deadline">{{ deadline.getDate().toString().padStart(2, "0") + "." +
                (deadline.getMonth() + 1).toString().padStart(2, "0") + "." +
                deadline.getFullYear() }}</p>
        </div>
    </div>
</template>

<style>
#assignment-content-dashboard {
    padding-bottom: 5%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-color: #46004075 #6b6b6b25;
}

#timecounter {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 20%;
    color: #ff00ffd7;
}

#deadline {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 20%;
    color: #ff00ffd7;
}

#time-container {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 15%;
    width: 100%;
    background-color: #270046ea;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
    bottom: 0;
    top: auto;
}

#title {
    margin-top: 20px;
    margin-bottom: 20px;
    color: #ff00ffd7;
}

#single-assignment-container-dashboard {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 85%;
    height: 45vh;
    background-color: #6b6b6b25;
    border-radius: 25px;
}

#description {
    margin-top: 20px;
    margin-bottom: 20px;
    color: #ff00ffd7;
    padding-left: 10%;
    padding-right: 10%;
}

#description a {
    color: #ff00ffd7;
}

#single-assignment-container::-webkit-scrollbar {
    display: none;
}
</style>