const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

async function updatevpngateData() {
    const csvFilePath = path.join(__dirname, 'Data', 'SubsiteData', 'VPN-Check', 'vpngate-vpn.csv');
    const rows = [];

    // Read the CSV file and process each row
    fs.readFile(csvFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading CSV file:', err);
            return;
        }

        // Split data into lines
        const lines = data.trim().split('\n');

        // Remove first and last line
        const trimmedLines = lines.slice(1, -1);

        // Join lines back into a string
        const newData = trimmedLines.join('\n');

        // Write the updated data back to the CSV file
        fs.writeFile(csvFilePath, newData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing updated data to CSV file:', err);
                return;
            }

            // Now parse the updated CSV file
            fs.createReadStream(csvFilePath)
                .pipe(parse())
                .on('data', (row) => {
                    // Keep only the IP column, assuming it's the second column (index 1)
                    const ip = row[1]; // Assuming IP is the second column
                    rows.push(ip);
                })
                .on('end', () => {
                    // Append each row to the CSV file
                    fs.writeFileSync(csvFilePath,"");
                    rows.forEach((ip) => {
                        fs.appendFileSync(csvFilePath, ip + '\n');
                    });
                    console.log('CSV file updated successfully');
                });
        });
    });
}

module.exports = { updatevpngateData };
