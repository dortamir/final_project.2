const models = require('../utils/db_utils/models');
const Order = models.Order;

//הוספת פריט להזמנה
exports.addToOrder = (req, res) => {
  try {
    const username = req.cookies.user.username; // קבלת שם משתמש מהקוקיז

    //בדיקה אם המשתמש מאומת
    if (!username) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const itemName = req.body.itemName;
    const quantity = parseFloat(req.body.quantity);
    const price = parseFloat(req.body.price);

    // קבלת נתוני ההזמנה הנוכחית מהקוקיז או אתחול אובייקט הזמנה ריק
    const order = req.cookies[`order`] || { username, items: [] };

    // בדיקה אם המשתמש כבר יש לו הזמנה בקוקיז
    if (order.username && order.username !== username) {
      return res.status(400).json({ message: 'User already has an order' });
    }
    // בדיקה אם הפריט קיים כבר בהזמנה
    const existingItem = order.items.find((item) => item.name === itemName);
    if (existingItem) {
      existingItem.quantity += quantity; // עדכון כמות
    } else {
      // הוספת הפריט החדש להזמנה
      order.items.push({
        name: itemName,
        price: price,
        quantity: quantity,
      });
    }

    // שמירת ההזמנה המעודכנת בקוקיז
    res.cookie(`order`, order);

    res.status(200).json(order);
  } catch (err) {
    console.error('Failed to add item to order:', err);
    res.status(500).json({ message: 'Failed to add item to order' });
  }
};

//פונקצייה לשליחת הזמנה
exports.submitOrder = async (req, res) => {
  try {
    const username = req.cookies.order.username; // קבלת שם המשתמש מהעוגיות
    console.log('user: ', username);
    const items = req.cookies.order.items || []; // קבלת הפרטים מהעוגיות
    const transactionDate = new Date(); // קבלת התאריך והשעה הנוכחיים
    console.log('items:', items);

    // בדיקה אם שם המשתמש והפריטים קיימים
    if (!username || !items || !transactionDate) {
      throw new Error('Invalid order data');
    }

    const formattedDate = transactionDate.toISOString().substring(0, 10); // Extract the first 10 characters (YYYY-MM-DD)
    const formattedHour = transactionDate.toISOString().substring(11, 16); // Extract the hour part (HH:MM)

    console.log('transactionDate:', formattedDate);
    console.log('transactionDate:', formattedHour);

    // יצירת מסמך הזמנה חדש במסד הנתונים
    const newOrder = await Order.create({
      user: username,
      items: items,
      transactionDate: {
        date: formattedDate,
        hour: formattedHour
      }
    });

    res.clearCookie('order');

    console.log('Order submitted successfully');

    // החזרת תגובת הצלחה
    res.status(200).json({ message: 'Order submitted successfully' });
  } catch (error) {
    console.error('Failed to submit order:', error);
    res.status(500).json({ error: 'Failed to submit order' });
  }
};

//פונקצייה למחיקת פריט מהזמנה
exports.deleteItem = (req, res) => {
  try {
    const itemName = req.body.itemName;

    // קבלת נתוני ההזמנה הנוכחית מהקוקיז
    let order = req.cookies.order;

    // בדיקה אם ההזמנה קיימת
    if (!order) {
      return res.status(400).json({ message: 'Order not found' });
    }

    // מציאת האינדקס של הפריט בהזמנה
    const itemIndex = order.items.findIndex((item) => item.name === itemName);

    // בדיקה אם הפריט קיים בהזמנה
    if (itemIndex === -1) {
      return res.status(400).json({ message: 'Item not found in order' });
    }

    console.log('Item index:', itemIndex);
    console.log('Item name:', itemName);

    const deletedItemName = order.items[itemIndex].name;

    // הסרת הפריט מההזמנה
    order.items.splice(itemIndex, 1);

    // בדיקה אם ההזמנה ריקה
    if (order.items.length === 0) {
      // ניקוי קוקיז ההזמנה
      res.clearCookie('order');
    } else {
      // עדכון ההזמנה בקוקיז
      res.cookie('order', order);
    }

    console.log(`Deleted item: ${deletedItemName}`);

    res.status(200).json(order);
  } catch (error) {
    console.error('Failed to delete item from order:', error);
    res.status(500).json({ message: 'Failed to delete item from order' });
  }
};

