<script>
export default {
    name: 'GitView',
    mounted:
        async function () {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            console.log(code);
            if (code) {
                const result = await fetch("https://relacexyz.duckdns.org/api/auth/tpapi/settoken", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: code,
                        api: 'github',
                        jwt: localStorage.getItem('token')
                    })
                });
                const data = await result.json();
                if (!data.success) {
                    alert('An error occurred while connecting to GitHub: ' + data.message);
                }
                window.location.href = 'https://www.relacexyz.duckdns.org/setting/connections';
            }
        }
}
</script>