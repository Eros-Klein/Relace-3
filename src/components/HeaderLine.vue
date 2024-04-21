<script>
export default {
    name: 'HeaderLine',
    methods:
    {
        setHeadline(headline) {
            document.getElementById('headline').innerText = headline;
        },
        loadStatus(percentage) {
            document.getElementById('line').style.display = "block";
            document.getElementById('line').style.width = percentage.toString() + "%";
        },
        addLoadStatus(percentage) {
            if (document.getElementById('line').style.width.split('%')[0] + percentage >= 100) {
                this.loadStatusSucceed();
            }
            else document.getElementById('line').style.width = (parseInt(document.getElementById('line').style.width) + percentage).toString() + "%";
        },
        loadStatusSucceed() {
            document.getElementById('line').style.width = "100%";
            setTimeout(() => {
                document.getElementById('line').style.display = "none";
                document.getElementById('line').style.width = "0%";
                setTimeout(() => {
                    document.getElementById('line').style.display = "block";
                }, 500);
            }, 500);
        },
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
    <div id="line"></div>
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

#line {
    background-color: rgba(153, 0, 173, 0.637);
    height: 2px;
    width: 0%;
    position: fixed;
    left: 0;
    transition: all 0.5s;
}
</style>