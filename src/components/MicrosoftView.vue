<script setup>
export default {
  name: 'MicrosoftView',
  mounted: async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log(code);

    if (code) {
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
          token: token,
          jwt: localStorage.getItem('token')
        })
      })
      const data = await response.json();
      if (!data.success) {
        alert('An error occurred while connecting to Microsoft: ' + data.message);
      }
      window.location.href = 'https://www.relacexyz.duckdns.org/setting/connections';
    }
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
}
</script>