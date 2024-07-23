// ordersControllers.js
const models = require('../utils/db_utils/models');
const Order = models.Order;

exports.addToOrder = (req, res) => {
  try {
    const username = req.cookies.user.username; // Get the username from cookies

    if (!username) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const itemName = req.body.itemName;
    const quantity = parseFloat(req.body.quantity);
    const price = parseFloat(req.body.price);

    // Get the current order data from cookies or initialize an empty order object
    const order = req.cookies[`order`] || { username, items: [] };

    // Check if the user already has an order in the cookies
    if (order.username && order.username !== username) {
      return res.status(400).json({ message: 'User already has an order' });
    }

    // Check if the item already exists in the order
    const existingItem = order.items.find((item) => item.name === itemName);
    if (existingItem) {
      existingItem.quantity += quantity; // Update the quantity
    } else {
      // Add the new item to the order
      order.items.push({
        name: itemName,
        price: price,
        quantity: quantity,
      });
    }

    // Store the updated order in cookies
    res.cookie(`order`, order);

    res.status(200).json(order);
  } catch (err) {
    console.error('Failed to add item to order:', err);
    res.status(500).json({ message: 'Failed to add item to order' });
  }
};
exports.submitOrder = async (req, res) => {
  try {
    const username = req.cookies.order.username; // Retrieve the username from the cookies
    console.log('user: ', username);
    const items = req.cookies.order.items || []; // Retrieve the items from the request body
    const transactionDate = new Date(); // Get the current date and time
    console.log('items:', items);
    // Check if username and items are available

    if (!username || !items || !transactionDate) {
      throw new Error('Invalid order data');
    }

    const formattedDate = transactionDate.toISOString().substring(0, 10); // Extract the first 10 characters (YYYY-MM-DD)
    const formattedHour = transactionDate.toISOString().substring(11, 16); // Extract the hour part (HH:MM)




    console.log('transactionDate:', formattedDate);
    console.log('transactionDate:', formattedHour);

    // Create a new Order document in the database
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

    // Return a success response
    res.status(200).json({ message: 'Order submitted successfully' });
  } catch (error) {
    console.error('Failed to submit order:', error);
    res.status(500).json({ error: 'Failed to submit order' });
  }
};

exports.deleteItem = (req, res) => {
  try {
    const itemName = req.body.itemName;

    // Get the current order data from cookies
    let order = req.cookies.order;

    // Check if the order exists
    if (!order) {
      return res.status(400).json({ message: 'Order not found' });
    }

    // Find the index of the item in the order
    const itemIndex = order.items.findIndex((item) => item.name === itemName);

    // Check if the item exists in the order
    if (itemIndex === -1) {
      return res.status(400).json({ message: 'Item not found in order' });
    }

    console.log('Item index:', itemIndex);
    console.log('Item name:', itemName);

    const deletedItemName = order.items[itemIndex].name;

    // Remove the item from the order
    order.items.splice(itemIndex, 1);

    // Check if the order is empty
    if (order.items.length === 0) {
      // Clear the order from cookies
      res.clearCookie('order');
    } else {
      // Update the order in cookies
      res.cookie('order', order);
    }

    console.log(`Deleted item: ${deletedItemName}`);

    res.status(200).json(order);
  } catch (error) {
    console.error('Failed to delete item from order:', error);
    res.status(500).json({ message: 'Failed to delete item from order' });
  }

};

