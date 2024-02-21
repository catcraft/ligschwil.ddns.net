// Import required modules
const express = require('express');
const cron = require('node-cron');
const path = require('path');
const { updateData } = require('./dataUpdater');
const { updatevpngateData } = require('./vpngatedata');

// Create Express application
const app = express();

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Mainsite', 'index.html'));
});

// Middleware to handle sub-site requests
app.use('/:subsite', (req, res, next) => {
  const subSite = req.params.subsite;
  const subSitePath = path.join(__dirname, 'subsites', subSite);

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

// Middleware to handle wildcard routes
app.use('*', (req, res, next) => {
  // If wildcard route reached, it means the requested sub-site does not exist
  res.status(404).send('Page not found');
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

// Start server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//Run updateData function immediately upon script startup
const update = false
if (update){
updateData().catch(error => {
  console.error('Error during initial data update:', error);
});
}

const updatevpn = false
if (updatevpn){
  updatevpngateData().catch(error => {
  console.error('Error during initial data update:', error);
});
}