<template>
  <div>

  </div>
</template>

<script>

export default {
  name: 'MicrosoftView',
  methods: {
    generateCodeChallenge() {
      const rand = new Uint8Array(32);
      crypto.getRandomValues(rand);
      const codeVerifier = this.base64URL(new CryptoJS.lib.WordArray.init(rand));
      const codeChallenge = this.base64URL(CryptoJS.SHA256(codeVerifier));

      return {codeChallenge, codeVerifier};
    },
    base64URL(string) {
      return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    },
    getCodeChallenge() {
      if ( !this.codeChallenge ) {
        this.codeChallenge = this.generateCodeChallenge().codeChallenge;
      }
      return this.codeChallenge;
    },
    getCodeVerifier() {
      if ( !this.codeVerifier ) {
        this.codeVerifier = this.generateCodeChallenge().codeVerifier;
      }
      return this.codeVerifier;
    },
    async getToken(code) {
      const clientId = process.env.VUE_APP_CLIENT_ID;
      const redirectUri = process.env.VUE_APP_REDIRECT_URI;
      const tenantId = process.env.VUE_APP_TENANT_ID;
      const scope = 'user.read mail.read';
      const grantType = 'authorization_code';
      const codeVerifier = this.getCodeVerifier();

      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('client_id', process.env.VUE_APP_CLIENT_ID);
      params.append('redirect_uri', process.env.VUE_APP_REDIRECT_URI);
      params.append('code', authorizationCode);
      params.append('code_verifier', codeVerifier);
      params.append('scope', 'https://graph.microsoft.com/.default');

      const tokenEndpoint = `https://login.microsoftonline.com/${process.env.VUE_APP_TENANT_ID}/oauth2/v2.0/token`;

      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      })
          .then(response => response.json())
          .then(data => {
            const userToken = data.access_token;
            // Use the user token here
            console.log(userToken);
            return userToken;
          });
    },
  },
  mounted: async function () {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code) {
      console.log(code);
      let token = await this.getToken(code);
      console.log(token);
      // Send the token to your API
      const response = await fetch('https://relacexyz.duckdns.org/api/auth/tpapi/settoken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api: 'microsoft',
          token: accessToken,
          jwt: localStorage.getItem('token')
        })
      });
    },
  },
  mounted: async function () {
const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');
    if (authorizationCode) {
      await this.getToken(authorizationCode);
      //window.location.href = 'https://www.relacexyz.duckdns.org/setting/connections';
    }
  },
}
</script>