const fs = require('fs');
const path = require('path');
module.exports = function(req, res, next) {
    const requesterIP = req.ip.replace("::ffff:", "")
    // Read files in the VPN-Check directory
    const vpnCheckDir = path.join(__dirname, "..",  "..","Data/SubsiteData/VPN-Check");
    fs.readdir(vpnCheckDir, (err, files) => {
        if (err) {
            console.error('Error reading VPN check directory:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Check if the requester's IP exists in any file
        let found = false;
        let matchingFiles = [];

        files.forEach(file => {
            const filePath = path.join(vpnCheckDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            if (fileContent.includes(requesterIP)) {
                found = true;
                matchingFiles.push(file);
            }
        });

        // Send response based on IP presence
        if (found) {
            res.json({ result: 'yes', files: matchingFiles, checked_ip: requesterIP });
        } else {
            res.json({ result: 'no', checked_ip: requesterIP});
        }
    });
};