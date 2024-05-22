<script>
import HeaderLine from './HeaderLine.vue';
import NavBar from './NavBar.vue';
import DashboardAssignmentView from './DashboardAssignmentView.vue';

export default {
    name: 'AssignmentView',
    data: function () {
        return {
            deadline: new Date(),
            timeTillDeadline: "",
            intervallId: 0,
            attachments: []
        }
    },
    methods: {
        async loadAndShowAssignments() {
            console.log('loadAndShowAssignments');
            DashboardAssignmentView.methods.toggleDropdown('attachment-dropdown', this.insertAttachments());
        },
        async insertAttachments() {
            console.log(this.attachments);
            let size = 0;
            const attachmentContainer = document.getElementById('hidden-link-container');
            attachmentContainer.innerHTML = '';
            for (let i = 0; i < this.attachments.length; i++) {
                const attachment = document.createElement('div');
                attachment.classList.add('hidden-element');
                attachment.innerHTML = `
        <p>${this.attachments[i].name}</p>
    `;
                attachment.addEventListener('click', () => {
                    window.open(this.attachments[i].link, '_blank');
                });
                attachmentContainer.appendChild(attachment);
                size += 75;
            }
            if (size > 350) {
                return "350px";
            }
            else {
                return size.toString() + "px";
            }
        },
        timeTillDeadlineCalc() {
            const now = new Date();
            const diff = this.deadline - now;
            if (diff < 0) {
                this.timeTillDeadline = 'Deadline passed';
                clearInterval(this.intervallId);
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            this.timeTillDeadline = days.toString().padStart(2, '0') + "d " + hours.toString().padStart(2, '0') + "h " + minutes.toString().padStart(2, '0') + "m " + seconds.toString().padStart(2, '0') + "s ";
        },
        async loadAssignment() {
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
                let link = document.getElementById('assignment-link');
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);

                newLink.addEventListener('click', () => {
                    window.open(data.assignment.linkToProvider, '_blank');
                });

                await DashboardAssignmentView.methods.toggleDropdown('attachment-dropdown', this.insertAttachments());
                await DashboardAssignmentView.methods.toggleDropdown('attachment-dropdown', this.insertAttachments());

                this.attachments = data.assignment.attachments;

                HeaderLine.methods.setHeadline(data.assignment.course);

                document.getElementById('title').innerText = data.assignment.title;

                document.getElementById('description').innerHTML = data.assignment.description;

                const date = new Date(data.assignment.deadline * 1000);
                this.deadline = date;

                this.intervallId = setInterval(this.timeTillDeadlineCalc, 1000);
                this.timeTillDeadlineCalc();
            } else {
                if (data.message.toLowerCase().includes('jwt') || data.message.toLowerCase().includes('expired')) {
                    NavBar.beforeMount();
                }
                else alert('An error occurred while loading the assignment: ' + data.message);
            }
            HeaderLine.methods.loadStatusSucceed();
        }
    },
    mounted: async function () {
        this.loadAssignment();
    },
    beforeUnmount: function () {
        clearInterval(this.intervallId);
    }
}

</script>

<template>
    <center>
        <div id="single-assignment-container">
            <h2 id="title"></h2>
            <p id="description"></p>
            <div id="time-container">
                <p id="timecounter">{{ timeTillDeadline }}</p>
                <p id="deadline">{{ deadline.getDate().toString().padStart(2, "0") + "." +
                    (deadline.getMonth() + 1).toString().padStart(2, "0") + "." +
                    deadline.getFullYear() }}</p>
            </div>
            <div id="attachment-dropdown">
                <div class="hidden-element-container" id="hidden-link-container">
                </div>
                <button id="attachment-download" class="trigger-dropdown-element"
                    @click="loadAndShowAssignments()">Download
                    Attachments : {{
                        attachments.length }}</button>
            </div>
            <button id="assignment-link">Go To Assignment</button>
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
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 85%;
    height: 75vh;
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
</style>