<script>
export default {
    name: 'ChatView',
    data() {
        return {
            messages: []
        }
    },
    methods: {
        async getChat() {
            const response = await fetch(`https://relacexyz.duckdns.org/api/chat/get/${this.$route.params.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jwt: localStorage.getItem('token')
                })
            });
            const data = await response.json();
            this.messages = data.success ? data.messages : [];
        },
        addMessage(message) {
            if (message.sender === localStorage.getItem('username')) {
                this.addMyMessage(message);
            } else {
                this.addForeignMessage(message);
            }
        },
        addMyMessage(message) {
            const chatContentContainer = document.getElementById('chat-message-container');
            const messageElement = document.createElement('div');
            messageElement.classList.add('my-message');
            messageElement.innerHTML = `
                <p class="content">${message.content}</p>
            `;
            chatContentContainer.appendChild(messageElement);
        },
        addForeignMessage(message) {
            const chatContentContainer = document.getElementById('chat-message-container');
            const messageElement = document.createElement('div');
            messageElement.classList.add('foreign-message');
            messageElement.innerHTML = `
                <p class="sender">${message.sender}:</p>
                <p class="content">${message.content}</p>
            `;
            chatContentContainer.appendChild(messageElement);
        },
        setScrollPosition() {
            const chatContentContainer = document.getElementById('chat-message-container');
            chatContentContainer.scrollTop = chatContentContainer.scrollHeight;
        }
    },
    mounted: async function () {
        const message = {
            sender: localStorage.getItem('username'),
            content: 'Hey i check garnix mehr kannst du mir bitte helfen hahaaaaaa was is los hier!'
        };
        const message2 = {
            sender: 'John Doe',
            content: 'Hey ich bin unnötig und kann nix!'
        };
        console.log(message);
        console.log(message2);

        this.addMessage(message);
        this.addMessage(message);
        this.addMessage(message2);
        this.addMessage(message2);
        this.addMessage(message);
        this.addMessage(message);
        this.addMessage(message2);
        //this.getChat();

        this.setScrollPosition();
    }
}

</script>

<template>
    <div id="chat-container">
        <div id="chat-content-container">
            <div id="chat-message-container">
            </div>
            <div id="input-bar">
                <input type="text" id="message-input" placeholder="Type a message..." />
                <button id="send-button">Send</button>
            </div>
        </div>
    </div>
</template>

<style>
#chat-container {
    align-items: center;
    height: 100%;
    margin-left: 392.5px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

#chat-content-container {
    display: flex;
    flex-direction: column;
    background-color: rgba(150, 150, 150, 0.178);
    border-radius: 15px;
    width: 80%;
    height: 80%;
}

.my-message {
    display: flex;
    align-items: flex-start;
    background-color: #cacaca3f;
    border-radius: 15px;
    padding: 5px;
    padding-left: 25px;
    padding-right: 25px;
    margin-bottom: 10px;
    left: 0;
    margin-right: auto;
    max-width: 50%;
}

.foreign-message {
    right: 0;
    margin-left: auto;
    background-color: #6b6b6b3f;
    border-radius: 15px;
    padding: 5px;
    padding-left: 25px;
    padding-right: 25px;
    margin-bottom: 10px;
    max-width: 50%;
}

.sender {
    font-weight: 700;
    margin-right: 5px;
    color: #d4d4d4;
    font-size: 1.5vh;
}

#input-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    bottom: 0;
    margin-top: auto;
    background-color: #6b6b6b3f;
    padding: 10px;
    border-radius: 15px;
}

#message-input {
    width: 80%;
    height: 30px;
    border-radius: 15px;
    padding-left: 15px;
    padding-right: 15px;
    border-style: solid;
    border-color: #46004075;
    background-color: rgba(180, 180, 180, 0.281);
    color: rgba(240, 248, 255, 0.753);
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
}

#message-input:focus {
    outline: none;
}

#send-button {
    width: 15%;
    height: 30px;
    border-radius: 15px;
    background-color: #46004075;
    color: rgba(240, 248, 255, 0.753);
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    border-style: solid;
    border-color: #46004075;
    cursor: pointer;
    transition: background-color 0.3s;
}

#send-button:hover {
    background-color: #6b6b6b;
}

#chat-message-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
    height: 100%;
    overflow-y: scroll;
}

#chat-message-container::-webkit-scrollbar {
    display: none;
}
</style>