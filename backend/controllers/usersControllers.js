const models = require('../utils/db_utils/models');
const users_model = models.User;

// פונקציה לרישום משתמש חדש
exports.signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // בדיקה אם משתמש עם אותו שם משתמש כבר קיים
        const existingUser = await users_model.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        // יצירת משתמש חדש
        await users_model.create({
            username: username,
            email: email,
            password: password
        });

        console.log("User created");
        return res.status(200).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to create user" });
    }
};

// פונקציה להתחברות משתמש קיים
exports.signIn = async (req, res) => {
    try {
        console.log('signIn method called');
        const { username, password } = req.body;
        console.log('Username:', username);
        console.log('Password:', password);
        // בדיקה אם משתמש עם אותו שם משתמש קיים במסד הנתונים
        const existingUser = await users_model.findOne({ username: username });
        if (!existingUser) {
            // אם המשתמש לא קיים, מחזירים הודעת שגיאה
            console.log('User does not exist');
            return res.status(400).json({ error: 'Username does not exist' });
        }

        // בדיקה אם הסיסמה שהוזנה תואמת לסיסמת המשתמש במסד הנתונים
        if (existingUser.password !== password) {
            // אם הסיסמה לא תואמת, מחזירים הודעת שגיאה
            console.log('Incorrect password');
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // יצירת עוגייה לזכור את ההתחברות של המשתמש
        res.cookie('user', existingUser, { maxAge: 86400000 }); // עוגייה שפגה לאחר 24 שעות

        // מחזירים הודעת הצלחה
        console.log('User signed in successfully');
        return res.json({ message: 'User signed in successfully' });

    } catch (error) {
        console.error('Error Logging In:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// פונקציה להתנתקות משתמש
exports.logout = async (req, res) => {
    try {
        // ניקוי הסשן של המשתמש
        req.session.destroy();

        // הסרת קוקיז המשתמש
        res.clearCookie('user');
        res.clearCookie('order');

        // ניתוב המשתמש לדף ההתחברות או לכל דף אחר
        res.redirect('/');
    } catch (error) {
        console.error('Error Logging Out:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
