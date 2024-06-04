fetch('https://api.github.com/applications/YOUR_CLIENT_ID/token', {
    method: 'POST',
    headers: {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Basic ' + btoa('YOUR_CLIENT_ID:YOUR_CLIENT_SECRET')
    },
    body: JSON.stringify({ "access_token": "ACCESS_TOKEN_TO_CHECK" })
});
