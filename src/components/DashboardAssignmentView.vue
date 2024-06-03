<script>
import DashboardView from './DashboardView.vue';
import HeaderLine from './HeaderLine.vue';
import NavBar from './NavBar.vue';

export default {
    name: 'DashboardAssignmentView',
    methods: {
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
        async toggleDropdown(attachment, pixelHeight) {
            pixelHeight = await pixelHeight;
            const attachmentElement = document.getElementById(attachment);
            if (pixelHeight == '0px') {
                attachmentElement.style.display = 'none';
            }
            else {
                attachmentElement.style.display = 'flex';
            }
            DashboardView.methods.toggleDropdown(attachment, pixelHeight);
        },
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
                this.attachments = data.assignment.attachments;
                const doneButton = document.getElementById('assignment-change-done');
                doneButton.addEventListener('click', () => {
                    this.updateSubmissionStatus(code, data.assignment.done);
                });
                doneButton.innerText = data.assignment.done ? '❌' : '✔️';
                
                document.getElementById('assignment-delete').addEventListener('click', () => {
                    this.deleteAssignment(code);
                });

                console.log(data.assignment.attachments);

                await this.toggleDropdown('attachment-dropdown', this.insertAttachments());
                await this.toggleDropdown('attachment-dropdown', this.insertAttachments());

                document.getElementById('title').innerText = data.assignment.title;

                document.getElementById('description').innerHTML = data.assignment.description;

                let link = document.getElementById('assignment-link');
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);

                newLink.addEventListener('click', () => {
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
              console.log(data);
              if (data.message.toLowerCase().includes('jwt') || data.message.toLowerCase().includes('token') || data.message.toLowerCase().includes('expired')) {
                    NavBar.beforeMount();
                }
                else alert('An error occurred while loading the assignment: ' + data.message);
            }
            HeaderLine.methods.addLoadStatus(70);
        },
      async deleteAssignment(code){
        HeaderLine.methods.loadStatus(30);
        const response = await fetch("https://relacexyz.duckdns.org/api/a/delete", {
          method: "DELETE",
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
          window.location.href = "/dashboard";
        } else {
          console.log(data);
          if (data.message.toLowerCase().includes('jwt') || data.message.toLowerCase().includes('token') || data.message.toLowerCase().includes('expired')) {
            NavBar.beforeMount();
          }
          else alert('An error occurred while deleting the assignment: ' + data.message);
        }
        HeaderLine.methods.addLoadStatus(70);
      },
      async updateSubmissionStatus(code, status){
        HeaderLine.methods.loadStatus(30);
        const response = await fetch("https://relacexyz.duckdns.org/api/a/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jwt: localStorage.getItem("token"),
            id: code,
            done: !status
          }),
        });
        const data = await response.json();
        console.log(data);
        if (data.success) {
          await this.reloadAssignment(code);
        } else {
          console.log(data);
          if (data.message.toLowerCase().includes('jwt') || data.message.toLowerCase().includes('token') || data.message.toLowerCase().includes('expired')) {
            NavBar.beforeMount();
          }
          else alert('An error occurred while updating the submission status: ' + data.message);
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
            attachments: []
        }
    },
    mounted: async function () {
        HeaderLine.methods.loadStatus(0);
        await this.reloadAssignment(this.$route.params.id);

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
        </div>
        <button id="assignment-link">Go To Assignment</button>
        <button id="assignment-delete"><img src="../assets/images/recycle-bin.png" alt="🗑️">️</button>
        <button id="assignment-change-done"><p>✔️</p></button>
        <div id="attachment-dropdown">
            <div class="hidden-element-container" id="hidden-link-container">
            </div>
            <button id="attachment-download" class="trigger-dropdown-element"
                @click="toggleDropdown('attachment-dropdown', insertAttachments())">Download Attachments : {{
                    attachments.length }}</button>
        </div>
        <div id="time-container">
            <p id="timecounter">{{ timeTillDeadline }}</p>
            <p id="deadline">{{ Math.floor(deadline.getTime() / 1000) == 0 ? "No Deadline" :
                deadline.getDate().toString().padStart(2, "0")
                +
                "." +
                (deadline.getMonth() + 1).toString().padStart(2, "0") + "." +
                deadline.getFullYear() }}</p>
        </div>
    </div>
</template>

<style>
#assignment-change-done{
  position: absolute;
  left: 2.5%;
  top: 10%;
  height: 5vh;
  width: 5vh;
  border-color: #ff00ffd7;
  border-style: solid;
  background-color: #460040f5;
  border-radius: 25px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
}

#assignment-change-done:hover{
  background-color: #ff00ffd7;
}

#assignment-delete{
  position: absolute;
  right: 2.5%;
  top: 10%;
  height: 5vh;
  width: 5vh;
  border-color: #ff00ffd7;
  border-style: solid;
  background-color: #460040f5;
  border-radius: 25px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease-in-out;
}

#assignment-delete:hover{
  background-color: #ff00ffd7;
}

#hidden-link-container {
    bottom: 120%;
    background-color: #270046f6;
}

#attachment-dropdown {
    position: absolute;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
    width: 20%;
    bottom: 20%;
    left: 2.5%;
}

#assignment-link {
    user-select: none;
    background-color: #460040f5;
    width: 20%;
    border-radius: 25px;
    color: #ff00fff8;
    padding: 10px;
    border-style: solid;
    border-color: #ff00ffd7;
    font-size: 2vh;
    position: absolute;
    cursor: pointer;
    bottom: 20%;
    right: 2.5%;
    transition: all 0.3s ease-in-out;
}

#attachment-download {
    background-color: #460040f5;
    width: 100%;
    border-radius: 25px;
    color: #ff00fff8;
    padding: 10px;
    border-style: solid;
    border-color: #ff00ffd7;
    font-size: 2vh;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
}

#attachment-download:hover {
    background-color: #ff00ffd7;
    color: #460040f5;
}

#assignment-link:hover {
    background-color: #ff00ffd7;
    color: #460040f5;
}

#assignment-content-dashboard {
    padding-bottom: 5%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
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
    background-color: #270046f6;
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