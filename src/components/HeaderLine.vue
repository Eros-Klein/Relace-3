<script lang="ts">
export default {
    name: 'HeaderLine',
    methods:
    {
        setHeadline(headline : string) {
            document.getElementById('headline')!.innerText = headline;
        },
        loadStatus(percentage : number) {
            document.getElementById('line')!.style.display = "block";
            document.getElementById('line')!.style.width = percentage.toString() + "%";
        },
        addLoadStatus(percentage : number) {
            if (parseInt(document.getElementById('line')!.style.width.split('%')[0]) + percentage >= 100) {
                this.loadStatusSucceed();
            }
            else document.getElementById('line')!.style.width = (parseInt(document.getElementById('line')!.style.width) + percentage).toString() + "%";
        },
        loadStatusSucceed() {
          const loadLine = document.getElementById('line');
          if (loadLine !== null) {
            loadLine.style.width = "100%";
            setTimeout(() => {
              loadLine.style.display = "none";
              loadLine.style.width = "0%";
              setTimeout(() => {
                loadLine.style.display = "block";
              }, 500);
            }, 500);
          }
        },
    },
    data() {
        return {
            timeActualicer: setInterval(() => {
                const nowTime = new Date();
                //@ts-ignore
                this.time = nowTime.getHours().toString().padStart(2, "0") + ":" + nowTime.getMinutes().toString().padStart(2, "0");
            }, 1000),
            time: "",
            headline: "",
        }
    },
    beforeMount() {
        const nowTime = new Date();
        //@ts-ignore
        this.time = nowTime.getHours().toString().padStart(2, "0") + ":" + nowTime.getMinutes().toString().padStart(2, "0");
    },
    beforeUnmount() {
         //@ts-ignore
        clearInterval(this.timeActualicer);
    }
}
</script>

<template>
    <div id="line">
    </div>
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
    background-color: rgb(153, 0, 173);
    height: 2px;
    width: 0%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    transition: all 0.5s;
}
</style>