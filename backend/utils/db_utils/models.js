const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// הגדרת הסכימה של פריט
const itemSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
});

// הגדרת הסכימה של משתמש
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },/////OR require
  password: { type: String, required: true },
  email: { type: String, required: true },
});

// פונקציה להשוואת סיסמאות באמצעות bcrypt
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// הגדרת הסכימה של הזמנה
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    type: String,
    required: true,
  },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  transactionDate: {
    date: { type: Date },
    hour: { type: String },
  },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

// וירטואל להוספת שדה מחושב עם תאריך ושעה בפורמט מסוים
orderSchema.virtual('transactionDateTimeFormatted').get(function () {
  return `Date: ${this.transactionDate.date}\nHour: ${this.transactionDate.hour}`;
});

// Create the models
const Item = mongoose.model('Item', itemSchema);
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

// Export the models
module.exports = { Item, User, Order };
