const fs = require('fs');
const { parse } = require('csv-parse');
const axios = require('axios');

async function updateData() {
  try {
    console.log('Updating data from CSV...');

    const data = [];

    // Read the CSV file
    fs.createReadStream('./Updates.csv')
      .pipe(
        parse({
          delimiter: ',',
          columns: true,
          ltrim: true,
        })
      )
      .on('data', async function (row) {
        // This will push the object row into the array
        data.push(row);
        
        const url = row.URL;
        const destination = row.Destination;
        const addHeaders = row['Add-Headers'] === 'true'; // Convert string to boolean
        const headers = row.Headers ? row.Headers.split(',') : [];

        // Fetch data from the provided URL
        const response = await axios.get(url);
        let newData = response.data;

        // Add headers if required
        if (addHeaders) {
          const headerLine = headers.join(',') + '\n';
          newData = headerLine + newData;
        }

        // Write the fetched data to the destination file
        fs.writeFileSync(destination, newData, 'utf8');
        console.log('Data updated successfully:', destination);
      })
      .on('error', function (error) {
        console.log(error.message);
      })
      .on('end', function () {
        console.log('Data update from CSV finished');
      });
  } catch (error) {
    console.error('Error updating data from CSV:', error);
  }
}

// Call the function to update data from CSV when the script starts
module.exports = { updateData };
