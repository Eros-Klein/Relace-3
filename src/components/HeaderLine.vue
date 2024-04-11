<script>
export default {
    name: 'HeaderLine',
    methods:
    {
        setHeadline(headline) {
            document.getElementById('headline').innerText = headline;
        }
    },
    data() {
        return {
            timeActualicer: setInterval(() => {
                const nowTime = new Date();
                this.time = nowTime.getHours().toString().padStart(2, "0") + ":" + nowTime.getMinutes().toString().padStart(2, "0");
            }, 1000),
            time: "",
            headline: "",
        }
    },
    beforeMount() {
        const nowTime = new Date();
        this.time = nowTime.getHours().toString().padStart(2, "0") + ":" + nowTime.getMinutes().toString().padStart(2, "0");
    },
    beforeUnmount() {
        clearInterval(this.timeActualicer);
    }
}
</script>

<template>
    <div id="container">
        <div id="headline-container">
            <h2 id="headline">{{ headline }}</h2>
            <p>{{ time }}</p>
        </div>
    </div>
</template>

<style>
#headline-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 82.5%;
    align-items: center;
    padding: 20px;
    animation: colorChange 90s infinite;
    font-size: 20px;
}
</style>