<script>
export default {
    name: 'NewsletterView',
    methods: {
        async subscribe() {
            console.log(`https://relacexyz.duckdns.org/api/newsletter/subscribe/${document.getElementById('email-input').value}`);
            const response = await fetch(`https://relacexyz.duckdns.org/api/newsletter/subscribe/${document.getElementById('email-input').value}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            response.json().then(data => {
                if (data) {
                    alert('Subscribed!');
                } else {
                    alert('Failed to subscribe.');
                }
            });
        }
    },
    props: {
        selected: String
    }
}
</script>

<template>
    <div id="container">
        <div id="content">
            <p>Want to always stay caught up?</p>
            <input id="email-input" placeholder="Your Email...">
            <button @click="subscribe" id="subscribe-button">Subscribe</button>
        </div>
    </div>
</template>

<style>
#email-input {
    width: 90%;
    height: 30px;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: rgba(180, 180, 180, 0.281);
    border-radius: 15px;
    border-style: solid;
    color: rgba(240, 248, 255, 0.753);
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    border-color: #46004075;
    padding-left: 15px;
    padding-right: 15px;

}

#email-input:hover {
    background-color: rgba(180, 180, 180, 0.5);
}

#email-input:focus {
    outline: none;
}

#subscribe-button {
    width: 50%;
    height: 30px;
    margin: 10px;
    background-color: rgba(180, 180, 180, 0.281);
    border-radius: 15px;
    border-style: solid;
    color: rgba(240, 248, 255, 0.753);
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    border-color: #46004075;
}

#subscribe-button:hover {
    background-color: rgba(180, 180, 180, 0.5);
    cursor: pointer;
}
</style>