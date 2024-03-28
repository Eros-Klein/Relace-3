<script>
export default {
    name: 'MessangerView',
    methods: {
        createUser(name, last_message, time, code) {
            const user = document.createElement("div");
            user.addEventListener("click", () => {
                this.goToUser(code);
            });
            user.classList.add("user");
            user.innerHTML = `
                <div class="pfp">
                    <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" class="avatar">
                </div>
                <div class="user-information">
                    <div class="user-head">
                        <p class="name">${name}</p>
                    </div>
                    <div class="user-body">
                        <p class="sender">You: </p>
                        <p class="last-message">${last_message}</p>
                        <p>•</p>
                        <p class="time">${time}</p>
                    </div>
                </div>
            `;
            document.getElementById("nav-bar-messanger").appendChild(user);
        },
        goToUser(code) {
            this.$router.push('/m/' + code);
        }
    },
    beforeMount: function () {
        document.getElementById("headline-container").style.display = "none";

    },
    mounted: function () {
        document.getElementById("headline-container").style.display = "none";
        this.createUser("Leo", "DEGGAH!", "5h", "c199jc12mkehm1nlnfk31");
        this.createUser("Felix", "Schau mein Geo...", "1 week", "d1221dz9192hdh22jd1");
        this.createUser("Vincent", "sent an assignment.", "10 days", "asdaWwA123sadae2131d31");
    },
    beforeUnmount: function () {
        document.getElementById("headline-container").style.display = "flex";
    }
}
</script>

<template>
    <div id="nav-bar-messanger">
        <h2>Messages</h2>
        <div id="search-bar">
            <input type="text" placeholder="Search Friend...">
        </div>
    </div>
    <RouterView />
</template>

<style>
.avatar {
    vertical-align: middle;
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.user-information {
    margin-top: 20px;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.user:hover {
    background-color: #6b6b6b3f;
    cursor: pointer;
}

.user {
    padding-left: 20px;
    padding-right: 20px;
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    user-select: none;
    border-bottom: 2px solid #46004075;
}

.user-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 20px;
}

.user-body p {
    margin-right: 5px;
    font-size: 15px;
}

.user-body {
    display: flex;
    flex-direction: row;
}

#search-bar {
    width: 100%;
}

#search-bar input {
    color: #d4d4d4;
    width: 100%;
    font-size: 20px;
    text-align: left;
    margin-bottom: 20px;
    padding: 10px;
    background-color: #cccccc1c;
    border: none;
    border-style: solid;
    border-color: #46004075;
}

#search-bar input:focus {
    outline: none;
}

#nav-bar-messanger h2 {
    color: #d4d4d4;
    font-size: 20px;
    text-align: center;
    margin-bottom: 20px;
}

#nav-bar-messanger {
    align-items: center;
    width: 40px;
    height: 100%;
    background-color: #6800886b;
    position: fixed;
    top: 0;
    left: 0;
    width: 350px;
    margin-left: 50px;
    z-index: 1;
    overflow-x: hidden;
    padding-top: 20px;
    padding-bottom: 20px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-content: center;
    border-right: black 2.5px solid;
}
</style>