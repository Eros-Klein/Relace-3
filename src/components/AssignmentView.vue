<script>
export default {
    name: 'AssignmentView'
}

</script>

<template>
    <div id="container">
        <div id="single-assignment-container">
            <p>{{ $route.params.id }}</p>
        </div>
    </div>

</template>

<style>
#single-assignment-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 85%;
    height: 75vh;
    background-color: #6b6b6b25;
    border-radius: 25px;
}
</style>