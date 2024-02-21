const net = require('net');
const { stringify } = require('querystring');

module.exports = function(req, res) {
    if (req.method === 'GET' && req.path === "/") {
        // Render the HTML form
        res.sendFile('index.html', { root: __dirname });
    } else if (req.method === 'GET' && req.path === "/api") {
        const apiEndpoint = {
            endpoint: "/api/port-check",
            description: "Check if a specific port is open or closed at a given address.",
            usage: "POST /api/port-check",
            parameters: {
                address: "string (IPv4 or IPv6)",
                port: "number (1-65535)"
            },
            exampleRequest: {
                address: "127.0.0.1",
                port: 80
            },
            examplebatchrequest: {
                batch: 'curl -X POST -H "Content-Type: application/json" -d "{\"address\":\"ligschwil.ddns.net\",\"port\":443}" https://ligschwil.ddns.net/port-check'
            }
            
        };
        
        res.json(apiEndpoint);
    } else if (req.method === 'POST') {
        // Handle port check request

        let body = '';

        // Collect the request body
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // When request body is fully received
        req.on('end', () => {
            const { address, port } = JSON.parse(body);
            // Check if request is targeting restricted addresses
            var deny = false;
            if (String(address).includes("192.168.1.") || address === "127.0.0.1" || String(address).includes(".local") ){
              deny = true
            }

            if (deny === true){
              return res.status(403).json({ error: 'Forbidden' });
            }

            const client = new net.Socket();
            
            client.setTimeout(1000); // Timeout for connection attempt
            
            client.on('connect', function() {
                res.json({ message: `Port ${port} is open at ${address}` });
                client.end();
            });
            
            client.on('timeout', function() {
                res.json({ message: `Port ${port} is closed at ${address}` });
                client.destroy();
            });
            
            client.on('error', function() {
                res.json({ error: `Unable to connect to ${address}:${port}` });
            });
            
            client.connect(port, address);
        });
    } else {
        // Invalid route or method
        res.status(404).json({ error: 'Not found' });
    }
};
