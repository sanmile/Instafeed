const http = require('http');
const hostname = 'localhost';
const port = 8080;

const server = http.createServer((req, res)=>{
    res.statusCode = 200;
    res.headers('Content-Type','text/plain');

    const options = {
        hostname,
        port,
        path: '/articles',
        method: 'GET'
    }
      
    req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
    
    res.on('data', d => {
        process.stdout.write(d)
    })
    })
    
    req.on('error', error => {
    console.error(error)
    })

    req.end()
    res.end();
});

server.listen(port, hostname, () =>{
    console.log(`Server running at http://${hostname}:${port}/`);
});



