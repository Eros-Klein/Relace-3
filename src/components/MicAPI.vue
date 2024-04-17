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
  methods: {
    async authorizeAndFetchToken() {
      await this.authorize();
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        this.token = await this.getToken(code);
      }
    },
    async authorize() {
      const clientId = process.env.VUE_APP_CLIENT_ID;
      const redirectUri = process.env.VUE_APP_REDIRECT_URI;
      const scope = 'https://graph.microsoft.com/.default';

      window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}`;
    },
    async getToken(code) {
      const clientId = process.env.VUE_APP_CLIENT_ID;
      const clientSecret = process.env.VUE_APP_CLIENT_SECRET;
      const redirectUri = process.env.VUE_APP_REDIRECT_URI;
      const tenantId = process.env.VUE_APP_TENANT_ID;

      const params = new URLSearchParams();
      params.append('client_id', clientId);
      params.append('scope', 'user.read mail.read');
      params.append('code', code);
      params.append('redirect_uri', redirectUri);
      params.append('grant_type', 'authorization_code');
      params.append('client_secret', clientSecret);

      fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, { // Replace {tenant} with your tenant
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      })
          .then(response => response.json())
          .then(data => {
            const userToken = data.access_token;
            // Use the user token here
            console.log(userToken);
          });
    },
  },
  mounted() {
    window.onload = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authorizationCode = urlParams.get('code');
      if (authorizationCode) {
        this.getToken(authorizationCode);
      }
    };
  }
};
</script>

<template>
  <div>
    <h1>Token</h1>
    <p v-if="token">Token: {{ token }}</p>
    <p v-else>Loading token...</p>
    <button @click="authorizeAndFetchToken">Authorize</button>
  </div>
</template>

<style scoped>

</style>