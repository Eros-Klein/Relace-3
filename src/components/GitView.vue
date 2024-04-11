<script>
export default {
    name: 'GitView',
    mounted:
        function () {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            console.log(code);
            if (code) {
                localStorage.setItem('github', code);
                window.location.href = 'https://www.relacexyz.duckdns.org/setting/connections';
            }
        }
}
</script>