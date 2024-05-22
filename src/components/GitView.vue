<script>
export default {
    name: 'GitView',
    mounted:
        async function () {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            console.log(code);

            const result = await fetch("https://github.com/login/oauth/access_token?code=508390cbb89064396af2&client_id=a36482c8fbd0046dcc09&client_secret=3d65564dc7772002565a3227b68270a4283d3bc1", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin:': '*'
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
                    jwt: localStorage.getItem('token')
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