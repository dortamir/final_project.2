// server.js
const express = require('express');
const app = express();
const path = require('path');

// הגדרת EJS כהמנוע תצוגה
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'..', 'views'));

// הגדרת נתיב לדף הבית
app.get('/', (req, res) => {
  res.render('index', { title: 'Hello EJS' });
});

// הפעלת השרת
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
