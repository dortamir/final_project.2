const models = require('../utils/db_utils/models');
const Item = models.Item;

//פונקציה ליצירת פריט חדש 
exports.createItems = async (req, res) => {
    try {
        const { type, name, image, price } = req.body;
        const newItem = new Item({ type, name, image, price });
        const createdItem = await newItem.save();
        res.status(200).json(createdItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


//פונקציה לעדכון פריט קיים 
exports.updateItem = async (req, res) => {
  try {
    const { nameorigin, name, image, price } = req.body;

    const item = await Item.findOne({ name: nameorigin }).exec();

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // מעדכנים את הנתונים שנשלחו ב-body
  if (name) {
    item.name = name;
  }
  if (image) {
    item.image = image;
  }
  if (price) {
    item.price = price;
  }

  if (!name && !image && !price) {
    return res.status(400).json({ message: "No fields to update" });
  }

 // שומרים את הפריט המעודכן
  const updatedItem = await Item.findByIdAndUpdate(
    { _id: item._id },
    { name, image, price },
     { new: true }
  );

    
    res.status(200).json(updatedItem);
   
   
  } catch (err) {
    res.status(400).json({ error: err.message });
  }

};

//מחיקת פריט
exports.deleteItem = async (req, res) => {
  try {
      const itemId = req.body.itemId;
      console.log('Received request to delete item with ID:', itemId);
      const item = await Item.findByIdAndDelete(itemId);
      if (!item) {
          console.log('Item not found');
          return res.status(404).json({ message: "Item not found" });
      }
  } catch (err) {
      console.error('Error deleting item:', err);
      res.status(500).json({ error: err.message });
  }
};

//קבלת פריטים לפי סוג
exports.getItemsByType = async (req, res) => {
    try {
        const itemType = req.query.type;
        const items = await Item.find({ type: itemType }).exec();
        res.render("Necklaces", { items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to retrieve items by type" });
    }
};

//קבלת פריטים לפי שם
exports.getItemByName = async (req, res) => {
    try {
        const itemName = req.query.name;
        const item = await Item.findOne({ name: itemName }).exec();

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json(item);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to retrieve item by name" });
    }
};


//פונקצייה לקבלת כל הפריטים
exports.getItems = async (req, res) => {
    try {
        const Items_arr = await Item.find();
        console.log(Items_arr);
        res.send(Items_arr);
    } catch (err) {
        res.status(400).send(err);
    }
} // פילטרים ישלחו בבקשת HTTP, וכל מה שיתקבל ויתאים ישלח חזרה 

//פונקצייה להצגת מוצר בודד
exports.showSingleProduct = async (req, res) => {
  try {
    const itemID = req.params.id;
    const item = await Item.findOne({ name: itemID }).exec();

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const locals = { title: item.name };

    res.render("product/singleProduct", { locals, item });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};