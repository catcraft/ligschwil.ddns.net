// Import required modules
const express = require('express');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const { updateData } = require('./dataUpdater');
const { updatevpngateData } = require('./vpngatedata');

// Create Express application
const app = express();

const debug = true

if (debug === false){
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/ligschwil.ddns.net/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/ligschwil.ddns.net/fullchain.pem'),
};
}
// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Mainsite', 'index.html'));
});
app.get('/stylesheet.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'Mainsite', 'stylesheet.css'));
});
// Middleware to handle sub-site requests
app.use('/Main/Images/:subsite', (req, res, next) => {
  const subSite = req.params.subsite;
  const subSitePath = path.join(__dirname, 'Mainsite', "Images", subSite);
  // Try to require the sub-site's main script
  res.sendFile(subSitePath);
});

// Middleware to handle sub-site requests
app.use('/:subsite', (req, res, next) => {
  const subSite = req.params.subsite;
  const subSitePath = path.join(__dirname, 'Subsites', subSite, 'index.js');
  // Try to require the sub-site's main script
  try {
    const subSiteMain = require(subSitePath);
    // Pass the remaining part of the URL to the sub-site's script
    req.url = req.url.replace(`/${subSite}`, '');
    subSiteMain(req, res, next);
  } catch (error) {
    // Handle errors if the sub-site doesn't exist
    if (error.code === 'MODULE_NOT_FOUND') {
      // If the requested sub-site does not exist, pass to next middleware
      next();
    } else {
      next(error);
    }
  }
});

app.engine('html', require('ejs').renderFile);
app.use(function(req,res){
  res.status(404).render('error.html');
});


// Schedule a task to run at 00:00 (midnight) every day
cron.schedule('0 0 * * *', () => {
  // Run the update data function
  updateData().catch(error => {
    console.error('Error during data update:', error);
  });
});

// Schedule a task to run at 00:00 (midnight) every day
cron.schedule('0 5 * * *', () => {
  // Run the update data function
  updatevpngateData().catch(error => {
    console.error('Error during VPN data update:', error);
  });
});

if (debug === false){ 
// Start HTTPS server
const PORT = process.env.PORT || 80;
const server = require('https').createServer(options, app);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
}
else
{
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
}

// Run updateData function immediately upon script startup
const update = false;
if (update) {
  updateData().catch(error => {
    console.error('Error during initial data update:', error);
  });
}

const updatevpn = false;
if (updatevpn) {
  updatevpngateData().catch(error => {
    console.error('Error during initial data update:', error);
  });
}