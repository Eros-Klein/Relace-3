<script>
//import axios from 'axios';

import axios from "axios";

export default {
  name: 'MicAPI',
  data() {
    return {
      token: null,
      assignments: null,
    };
  },
  async created() {
    //this.token = await this.getToken();
    //console.log('Token:', this.token);
    //await this.sendTokenToBackend();
    //this.assignments = await this.getAssignmentsFromBackend();
  },

  methods: {
    async authorize() {
      const clientId = process.env.VUE_APP_CLIENT_ID;
      const redirectUri = encodeURIComponent(process.env.VUE_APP_REDIRECT_URI);
      const scope = encodeURIComponent(process.env.VUE_APP_SCOPE);
      const tenantId = process.env.VUE_APP_TENANT_ID;

      const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=${scope}`;

      try {
        const response = await axios.get(authUrl);
        return response.data;
      } catch (error) {
        console.error('Error during authorization:', error);
      }
    },
    /*async getToken() {
      try {
        const response = await axios.post(`https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`, {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          redirect_uri: process.env.REDIRECT_URI,
          grant_type: process.env.GRANT_TYPE,
        });

        console.log(response.data);

        return response.data.access_token;
      } catch (error) {
        console.error('Fehler beim Abrufen des Tokens:', error);
      }
    },
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