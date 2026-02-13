const http = require('http');

http.get('http://localhost:5000/api/doctors', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log(JSON.stringify(parsed, null, 2));
        } catch (e) {
            console.log(data);
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
