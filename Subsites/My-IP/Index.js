const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

// Function to retrieve country and ISP information based on IP address
function getIPInfo(ipAddress, callback) {
    const csvFilePath = path.join(__dirname, '..', '..', 'Data', 'SubsiteData', 'My-IP', 'IP-Location.csv');
    const ipInfo = {
        country: ''
    };

    let responseSent = false; // Flag to track if response has been sent

    fs.createReadStream(csvFilePath)
        .pipe(parse({
            columns: true,
            ltrim: true
        }))
        .on('data', (row) => {
            const startIP = row['Start IP'];
            const endIP = row['End IP'];
            const countryCode = row['Country'];

            // Check if the IP address falls within the range
            if (ipAddressInRange(ipAddress, startIP, endIP)) {
                ipInfo.country = countryCode;
                // Stop further processing once IP information is found
                if (!responseSent) {
                    responseSent = true;
                    callback(ipInfo);
                }
            }
        })
        .on('end', () => {
            // If no match found in the CSV file
            if (!responseSent) {
                responseSent = true;
                callback(ipInfo);
            }
        });
}

// Helper function to check if IP address falls within the range
function ipAddressInRange(ipAddress, startIP, endIP) {
    if (!startIP || !endIP) {
        return false; // Skip if start or end IP is missing
    }

    const ip = ipAddress.split('.').map(Number);
    const start = startIP.split('.').map(Number);
    const end = endIP.split('.').map(Number);

    for (let i = 0; i < 4; i++) {
        if (ip[i] < start[i] || ip[i] > end[i]) {
            return false;
        }
    }
    return true;
}

module.exports = function(req, res, next) {
    // Read the HTML file
    const htmlFilePath = path.join(__dirname, 'index.html');
    fs.readFile(htmlFilePath, 'utf8', (err, htmlContent) => {
        if (err) {
            console.error('Error reading HTML file:', err);
            res.status(500).send('Error reading HTML file');
            return;
        }
        // Replace the placeholder with the user's IP address
        const ipAddress = req.ip.replace("::ffff:", "");
        
        // Check if the request is for the API route
        if (req.url === '/api/ip') {
            res.json(ipAddress);
        }
        else if (req.url === '/api/country') {
            getIPInfo(ipAddress, (ipInfo) => {
                // Send the IP information as JSON response
                res.json(ipInfo);
            });
        }
        else if (req.url === '/api') {
            const apiInfo = {
                description: 'This API provides information about the country and IP adress.',
                usage: 'Send a GET request to /api/(Path) to retrieve the information. The response will be in JSON format.',
                Ip_Path: "/api/IP",
                Coutry_Path: "/api/country"
            };
            res.json(apiInfo);
        }
        else {
            // Get country and ISP information based on IP address
            getIPInfo(ipAddress, (ipInfo) => {
                const modifiedHtmlContent = htmlContent
                    .replace('__IP_ADDRESS__', ipAddress)
                    .replace('__COUNTRY__', ipInfo.country);

                // Send the modified HTML content as the response
                if (!res.headersSent) {
                    res.send(modifiedHtmlContent);
                }
            });
        }
    });
};
