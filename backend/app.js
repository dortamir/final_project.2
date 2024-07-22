require('dotenv').config();
const db = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const Item = require('./utils/db_utils/models').Item;
const Order = require('./utils/db_utils/models').Order;

const createApp = async function () {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static(path.join(process.cwd(), '../frontend')));
  app.use(require("./routes/users"));
  app.use(require("./routes/items"));
  app.use(require("./routes/orders"));
  app.use(session({
    secret: 'your-secret-key', // Replace with your own secret key
    resave: false,
    saveUninitialized: false,
  }));
  app.use(express.urlencoded({ extended: false }));

  console.log('App Created !');
  await db.connect(
    "mongodb+srv://shaniattias851:shaniattias851@cluster0.wtvqcd7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  ).then(()=>{
    console.log('Database Connected!');
  })
  .catch(()=>{
    console.log('failed');
  })

  // Set up the app configuration
  app.set('port', process.env.PORT || 4000);
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'frontend', 'views'));  //await load_routes(app);

  app.get('/signup', (req, res) => {
    res.render('signup');
  });

  
}