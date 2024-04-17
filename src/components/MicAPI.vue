<script>
//import axios from 'axios';

export default {
  name: 'MicAPI',
  data() {
    return {
      token: null,
      assignments: null,
    };
  },
  async created() {
    const code = this.getCodeFromUrl();
    this.token = await this.getToken(code);
    console.log('Token:', this.token);
    //await this.sendTokenToBackend();
    //this.assignments = await this.getAssignmentsFromBackend();
  },

  methods: {
    async authorize() {
      const clientId = process.env.VUE_APP_CLIENT_ID;
      const redirectUri = process.env.VUE_APP_REDIRECT_URI;

      console.log(redirectUri)

      const authority =`https://login.microsoftonline.com/91fc072c-edef-4f97-bdc5-cfb67718ae3a`;
      const authorizationUrl = `${authority}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=https://graph.microsoft.com/.default&state=12345`;

      window.location.href = authorizationUrl;

      let code = null;
      while (!code) {
        code = this.getCodeFromUrl();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Warten Sie 1 Sekunde, bevor Sie erneut überprüfen
      }

      console.log(code);
      this.token = await this.getToken(code);
      console.log('Token:', this.token);

    },
    getCodeFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('code');
    },
    async getToken(code) {
      const axios = require('axios');
      const params = new URLSearchParams();
      params.append('client_id', process.env.VUE_APP_CLIENT_ID);
      params.append('client_secret', process.env.VUE_APP_CLIENT_SECRET);
      params.append('redirect_uri', process.env.VUE_APP_REDIRECT_URI);
      params.append('grant_type', process.env.VUE_APP_GRANT_TYPE);
      params.append('code', code);

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

      try {
        const response = await axios.post(`${process.env.VUE_APP_AUTHORITY}/oauth2/v2.0/token`, params, config);
        return response.data.access_token;
      } catch (error) {
        console.error('Fehler beim Abrufen des Tokens:', error);
      }
    },
    /*
    async sendTokenToBackend() {
      try {
        const response = await axios.get(process.env.VUE_APP_BACKEND_API_URL, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });
        console.log('Response:', response);
      } catch (error) {
        console.error('Fehler beim Senden des Tokens an das Backend:', error);
      }
    },
    async getAssignmentsFromBackend() {
      try {
        const response = await axios.get('http://localhost:3000/assignments');
        return response.data;
      } catch (error) {
        console.error('Fehler beim Abrufen der Assignments Daten vom Backend:', error);
      }
    }*/
  }
};
</script>

<template>
  <div>
    <h1>Token</h1>
    <p v-if="token">Token: {{ token }}</p>
    <p v-else>Loading token...</p>
    <button @click="authorize">Authorize</button>
  </div>
</template>

<style scoped>

</style>