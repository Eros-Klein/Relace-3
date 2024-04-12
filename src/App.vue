<template>
  <div id="page-container">
    <HeaderLine />
    <RouterView />
    <NavBar selected="Home" />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import HeaderLine from './components/HeaderLine.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    HeaderLine
  },
}
</script>

<style>
#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

/* You can add global styles to this file, and also import other style files */

@keyframes colorChange {
  0% {
    color: #b400a7;
  }

  25% {
    color: #b460e7;
  }

  50% {
    color: #7029e7;
  }

  75% {
    color: #d622e7;
  }

  100% {
    color: #b400a7;
  }
}

#content {
  margin-left: 50px;
  margin-right: 50px;
}

p {
  color: #c480e7;
  font-size: 20px;
  font-weight: 500;
}

body {
  background: linear-gradient(90deg,
      #030b28 0%,
      #1d0a45 33%,
      #290951 52%,
      #1f0751 80%,
      #390452 100%);
  font-family: "Arial";
}

#page-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  bottom: 0;
  overflow: auto;
  position: fixed;
}

html {
  background: linear-gradient(90deg,
      #030b28 0%,
      #1d0a45 33%,
      #290951 52%,
      #1f0751 80%,
      #390452 100%);
  background-color: #030b28;

}
</style>
