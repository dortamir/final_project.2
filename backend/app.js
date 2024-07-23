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
  
  app.get('/signin', async (req, res) => {
    try {
      // Check if the user is already authenticated
      if (req.session.user) {
        // User is already signed in, redirect to a different page
        return res.redirect('/dashboard');
      }

      // Call your existing sign-in method to handle the authentication
      const signInResult = await signInUser(req.body.username, req.body.password);

      // Assuming the sign-in method returns a user object upon successful authentication
      const user = signInResult.user;

      // Store the user object in the session
      req.session.user = user;
      res.cookie('user', user);

      // Redirect the user to the dashboard or any other desired page
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error Signing In:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/check-login', (req, res) => {
    if (req.session.user || req.cookies.user) {
      // User is logged in
      return res.status(200).json({ loggedIn: true, user: req.session.user || req.cookies.user });
    } else {
      // User is not logged in
      return res.status(200).json({ loggedIn: false });
    }
  });

  app.get('/', function (req, res) {
    // Check if the user is logged in and retrieve the username from the cookies or wherever you store it
    const loggedIn = req.session.user || req.cookies.user;
    const username = loggedIn ? loggedIn.username : null;
  
    // Render the index.ejs template and pass the loggedIn and username variables as data
    res.render('index', { loggedIn: !!loggedIn, username: username });
  });

  app.get('/logout', async (req, res) => {
    try {
      // Clear the user's session or remove the user's cookie
      // For example, if you are using Express sessions with cookies:
      res.clearCookie('user'); // Clear the session cookie
      res.clearCookie('order');

      req.session.destroy(); // Destroy the session

      // Log a message to the terminal
      console.log('User logged out successfully.');

      // Redirect the user to the login page or any other desired page
      res.redirect('/'); // Redirect to the homepage
    } catch (error) {
      console.error('Error Logging Out:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/userprofile', (req, res) => {
    const username = req.cookies.user ? req.cookies.user.username : null; // Retrieve the 'username' cookie value if available
    res.render('userprofile', { username }); // Pass the 'username' variable to the template
  });
  
  app.get("/Necklaces", async (req, res) => {
    try {
      const username = req.cookies.user ? req.cookies.user.username : null;
      const Necklaces = await Item.find({ type: "Necklace" }).exec();
      // console.log(fruits); // Log the retrieved Necklaces data
      res.render("Necklaces", { username, Necklaces });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve Necklaces" });
    }
  });

  app.get("/Rings", async (req, res) => {
    try {
      const username = req.cookies.user ? req.cookies.user.username : null;
      const Rings = await Item.find({ type: "Ring" }).exec();
      // console.log(Rings); // Log the retrieved fruits data
      res.render("Rings", { username, Rings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve Rings" });
    }
  });

  app.get("/Bracelets", async (req, res) => {
    try {
      const username = req.cookies.user ? req.cookies.user.username : null;
      const Bracelets = await Item.find({ type: "Bracelate" }).exec();
      // console.log(Bracelets); // Log the retrieved fruits data
      res.render("Bracelets", { username, Bracelets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve Bracelets" });
    }
  });

  app.get("/earrings", async (req, res) => {
    try {
      const username = req.cookies.user ? req.cookies.user.username : null;
      const earrings = await Item.find({ type: "Earrings" }).exec();
      
      res.render("earrings", { username, earrings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve earrings" });
    }
  });

  app.get("/contact", (req, res) => {
    res.render("contact");
  });

  app.get("/up", (req, res) => {
    res.render("up");
  });

    app.get("/up", (req, res) => {
      const username = req.cookies.user ? req.cookies.user.username : null; // Retrieve the 'username' cookie value if available
      res.render("up", { username });
    });

    app.get('/orders', (req, res) => {
      const username = req.cookies.user ? req.cookies.user.username : null; // Retrieve the 'username' cookie value if available
  
      const items = req.cookies[`order`] || req.session.order || []; // Retrieve 'order' array from cookies first, then from session if not found
  
      res.render('orders', { username, items });
    });
  
    app.post('/items/delete', async (req, res) => {
      try {
        const itemId = req.body.Item.itemId;
        await Item.findByIdAndDelete(itemId);
        res.sendStatus(200);
      } catch (error) {
        console.error(error);
        res.sendStatus(500);
      }
    });




}