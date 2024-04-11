<script>
export default {
    name: 'WelcomeView',
    mounted: async function () {
        document.getElementById('side-bar').style.display = 'none';
        document.getElementById('headline-container').style.display = 'none';
    }
}

</script>

<template>
    <div id="welcome-container">
        <div id="content">
            <h1>Welcome to Relace</h1>
            <p>Relace is a platform that helps you to manage all of your assignments.</p>
            <p>It is easy to use and free.</p>
            <p>Just sign up and start using it.</p>
            <button @click="this.$router.push('/auth/signup')">Sign Up</button>
            <button @click="this.$router.push('/auth/login')">Log In</button>
        </div>
    </div>
</template>

<style>
#welcome-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

#content {
    width: 40%;
    height: 45%;
    padding: 50px;
    border-radius: 25px;
    background-color: #6b6b6b25;
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    align-items: center;
}

#content h1 {
    font-size: 2.5em;
    color: rgb(189, 119, 255);
}

#content p {
    margin-top: 15px;
    margin-bottom: 15px;
    font-size: 20px;
}

#content button {
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 10px;
    font-size: 20px;
    background-color: rgb(189, 119, 255);
    color: white;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    width: 25%;
    transition: background-color 0.3s;
}

#content button:hover {
    background-color: rgb(189, 119, 255, 0.8);
}
</style>