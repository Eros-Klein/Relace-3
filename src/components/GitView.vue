<script lang="ts">
export default {
    name: 'GitView',
    mounted:
        async function () {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            console.log(code);
            //3d65564dc7772002565a3227b68270a4283d3bc1 oauth
            //82b0237e500ac855af27507c558fa37bf289f371 app
            //Iv1.000062edb18edd6d app id
            //a36482c8fbd0046dcc09 oauth id

            const result = await fetch(`https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token?code=${code}&client_id=Iv1.000062edb18edd6d&client_secret=82b0237e500ac855af27507c558fa37bf289f371&redirect_uri=https://www.relacexyz.duckdns.org/git`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            const data = await result.json();
            console.log(data);

            const result2 = await fetch("https://relacexyz.duckdns.org/api/auth/tpapi/settoken", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: data.access_token,
                    api: 'github',
                    jwt: localStorage.getItem('token'),
                    key: localStorage.getItem('key')
                })
            });

            const data2 = await result2.json();
            console.log(data2);
            if (!data2.success) {
                alert('An error occurred while connecting to GitHub: ' + data2.message);
            }
            window.location.href = 'https://www.relacexyz.duckdns.org/setting/connections';
        }
}
</script>