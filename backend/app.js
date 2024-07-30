require('dotenv').config();
const db = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const Item = require('./utils/db_utils/models').Item;
const Order = require('./utils/db_utils/models').Order;
const User = require('./utils/db_utils/models').User; 

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

  // קביעת תצורת האפליקציה
  app.set('port', process.env.PORT || 4000);
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'frontend', 'views'));  //await load_routes(app);

  // ניתוב לעמוד הרשמה
  app.get('/signup', (req, res) => {
    res.render('signup');
  });
  
  // ניתוב לעמוד כניסה
  app.get('/signin', async (req, res) => {
    try {
      // בדיקת התחברות
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

  // ניתוב לבדיקת התחברות
  app.get('/check-login', (req, res) => {
    if (req.session.user || req.cookies.user) {
      // User is logged in
      return res.status(200).json({ loggedIn: true, user: req.session.user || req.cookies.user });
    } else {
      // User is not logged in
      return res.status(200).json({ loggedIn: false });
    }
  });

  // ניתוב לעמוד הבית
  app.get('/', function (req, res) {
    // Check if the user is logged in and retrieve the username from the cookies or wherever you store it
    const loggedIn = req.session.user || req.cookies.user;
    const username = loggedIn ? loggedIn.username : null;
  
    // Render the index.ejs template and pass the loggedIn and username variables as data
    res.render('index', { loggedIn: !!loggedIn, username: username });
  });

  // ניתוב להתנתקות מהמערכת
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

  // ניתוב לעמוד פרופיל משתמש
  app.get('/userprofile', (req, res) => {
    const username = req.cookies.user ? req.cookies.user.username : null; // Retrieve the 'username' cookie value if available
    res.render('userprofile', { username }); // Pass the 'username' variable to the template
  });
  
  // ניתוב לעמוד תכשיטים מסוג Necklaces
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

  // ניתוב לעמוד תכשיטים מסוג Rings
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

  // ניתוב לעמוד תכשיטים מסוג Bracelets
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

  // ניתוב לעמוד תכשיטים מסוג earrings
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

  // ניתוב לעמוד צור קשר
  app.get("/contact", (req, res) => {
    res.render("contact");
  });

  // ניתוב לעמוד up
  app.get("/up", (req, res) => {
    res.render("up");
  });

    app.get("/up", (req, res) => {
      const username = req.cookies.user ? req.cookies.user.username : null; // Retrieve the 'username' cookie value if available
      res.render("up", { username });
    });

    // ניתוב לעמוד הזמנות
    app.get('/orders', (req, res) => {
      const username = req.cookies.user ? req.cookies.user.username : null; // Retrieve the 'username' cookie value if available
  
      const items = req.cookies[`order`] || req.session.order || []; // Retrieve 'order' array from cookies first, then from session if not found
  
      res.render('orders', { username, items });
    });
  
    // ניתוב למחיקת פריטים
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

    // ניתוב לתוצאות חיפוש
    app.get('/searchResult', async (req, res) => {
      try {
        const username = req.cookies.user ? req.cookies.user.username : null;
  
        const query = req.query.query; // Get the search query from the URL parameter "query"
  
        // Perform the search by querying the items with names that include the search query
        const searchResults = await Item.find({ name: { $regex: query, $options: 'i' } });
  
        res.render('searchResult', { username, searchResults });
      } catch (error) {
        console.error('Failed to perform search:', error);
        res.status(500).send('Failed to perform search');
      }
    });

    // ניתוב לרשימת לקוחות
    app.get('/custList', async (req, res) => {
      try {
        console.log('Fetching customers from database...'); // לוג לפני שליפת הנתונים
        const customers = await User.find().exec();
        console.log('Customers fetched:', customers); // לוג אחרי שליפת הנתונים
        res.render('custList', { customers });
      } catch (error) {
        console.error('Error fetching customers:', error); // לוג במקרה של שגיאה
        res.status(500).send('Failed to fetch customers');
      }
    });
    
  // ניתוב לעמוד גרפים
    app.get("/graf", (req, res) => {
      res.render("graf");
    });

  // ניתוב למפת החנות
  app.get('/store_map', (req, res) => {
    const username = req.cookies.user ? req.cookies.user.username : null; // Retrieve the 'username' cookie value if available
    res.render('store_map', { username });
  });

  // ניתוב להיסטוריית עסקאות
  app.get('/transaction_history', async (req, res) => {
    try {
      const username = req.cookies.user ? req.cookies.user.username : null;

      let orders = [];
      if (username === 'manager') {
        orders = await Order.find({}).sort({ transactionDate: -1 });
      } else {
        orders = await Order.find({ user: username }).sort({ transactionDate: -1 });
      }

      res.render('transaction_history', { username, orders });
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
      res.status(500).send('Failed to fetch transaction history');
    }
  });

  return app;
}
module.exports = { db, createApp };