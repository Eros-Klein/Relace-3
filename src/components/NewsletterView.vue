<script lang="ts">
import HeaderLine from './HeaderLine.vue';

export default {
    name: 'NewsletterView',
    methods: {
        async subscribe() {
            console.log(`https://relacexyz.duckdns.org/api/newsletter/subscribe/${(document.getElementById('email-input') as HTMLInputElement).value}`);
            const response = await fetch(`https://relacexyz.duckdns.org/api/newsletter/subscribe/${(document.getElementById('email-input') as HTMLInputElement).value}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.success) {
                alert('You have successfully subscribed to our newsletter!');
            } else {
                alert('There was an error subscribing to our newsletter. Please try again later.');
            }
        }
    },
    mounted: function () {
        HeaderLine.methods!.setHeadline('Newsletter');
    }
}
</script>

<template>
    <div id="container">
        <div id="news-content">
            <p>Want to always stay caught up?</p>
            <input id="email-input" placeholder="Your Email...">
            <button @click="subscribe" id="subscribe-button">Subscribe</button>
        </div>
        <div id="doccontainer">
            <h2 id="doctitle">Documentation: <a href="https://relacexyz.duckdns.org/doc/" id="docbody">relacexyz/doc</a></h2>
        </div>
    </div>
</template>

<style>
#doccontainer {
    position: fixed;
    bottom: 5%;
    width: auto;
    text-align: center;
    background-color: rgba(109, 10, 114, 0.281);
    border-radius: 15px;
    border-color: rgb(255, 0, 230);
    color: rgb(208, 43, 226);
    padding-left: 2%;
    padding-right: 2%;
}

#doctitle {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
}

#docbody {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    color: rgb(208, 43, 226);
}

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