const models = require('../utils/db_utils/models');
const Item = models.Item;

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



exports.getItems = async (req, res) => {
    try {

        // HTTP-body example: {"filters": {...}, "search_method": ...}
        const Items_arr = await Item.find();
        console.log(Items_arr);
        res.send(Items_arr);
    } catch (err) {
        res.status(400).send(err);
    }
} // filters will be sent in the http request, and all objects that satisfies this filters will send back


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