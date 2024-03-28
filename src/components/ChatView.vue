<script>
export default {
    name: 'ChatView',
    beforeMount: function () {
        document.getElementById("headline-container").style.display = "none";

    },
    beforeUnmount: function () {
        document.getElementById("headline-container").style.display = "flex";
    }
}

</script>

<template>
    <div id="chat-container">
        <div id="content">
            <p>{{ $route.params.id }}</p>
        </div>
    </div>
</template>

<style>
#chat-container {
    align-items: center;
    width: 77.5%;
    height: 100%;
    margin-left: 392.5px;
    background-color: rgba(150, 150, 150, 0.178);
    padding: 20px;
}
</style>