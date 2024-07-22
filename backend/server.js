const { createApp } = require('./app');

createApp()
  .then(app => {
    const port = app.get('port');
    console.log(`Server running on port ${port}`);
    app.listen(port);
  })
  .catch(error => {
    console.error('Error creating the app:', error);
  });