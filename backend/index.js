const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const cors = require('cors');
const path = require('path');
const multer = require('multer');


// app.use(cors());
app.use(cors({
  origin: 'https://thissideup-react.onrender.com',
  credentials: true // if you're using cookies or auth
}));
app.use(express.json());

// Database Connetion
mongoose.connect("mongodb+srv://darys:cY0TWZoMSQIIWBi1@thissideupsite.knxw6oo.mongodb.net/ThisSideUp")

app.get("/", (req, res) =>{
    res.send("Express App is running")
})

// Image Storage
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req, file, cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})



const upload = multer({storage: storage});

app.use('/images', express.static(path.join(__dirname, 'upload/images')));

app.use('/images', express.static('upload/images'))

app.post("/upload", upload.single('product'), (req, res)=>{
    res.json({
        success:1, 
        image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
});

// Schema for Creating Products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true
    },
    name: { type: String, required: true },
    description: String,
    image: String,
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 70 },
    tags: [String],
    rating: { type: Number, default: 0 },
    numRatings: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    available: {
        type: Boolean,
        default: true
    }
})
app.post('/addproduct', async (req, res) => {
    let products =  await Product.find({});
    let id;
    if (products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        price: req.body.price,
        tags: req.body.tags,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name
    })
});

// Editing Product
app.post('/updateproduct/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const updatedProduct = await Product.findOneAndUpdate(
        { id: productId },
        {
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            category: req.body.category,
            price: req.body.price,
            stock: req.body.stock,
            },
        { new: true }
        );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product: updatedProduct });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Deleting Products
app.post('/deleteproduct', async (req, res)=>{
    await Product.findOneAndDelete({id: req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
});

// Getting All Products
app.get('/allproducts', async (req, res)=>{
    let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
});

// Getting One Product
app.get('/products/:id', async (req, res)=>{
    const numericId = parseInt(req.params.id, 10);
    let product = await Product.findOne({ id: numericId});
    if(!product){
        return res.status(404).send({message:'Product not found'})
    }
    console.log(`Product with ID fetched`);
    res.send(product);
});

// Liking a Product
app.patch('/products/:id/like', async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { id: parseInt(req.params.id, 10) },
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).send({ message: "Product not found" });
    res.send(updated);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Unliking a product
app.patch('/products/:id/unlike', async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { id: parseInt(req.params.id, 10) },
      { $inc: { likes: -1 } },
      { new: true }
    );
    if (!updated) return res.status(404).send({ message: "Product not found" });

    if (updated.likes < 0) {
      updated.likes = 0;
      await updated.save();
    }

    res.send(updated);
  } catch (err) {
    console.error("Error unliking product:", err);
    res.status(500).send({ message: err.message });
  }
});

// User Model
const Users = mongoose.model('Users', {
    name: {type: String},
    email: {type: String, unique: true},
    role: {type: String},
    password: {type: String},
    cartData: {type: Object},
    date: {type: Date, default: Date.now},
})

// Sign Up
app.post('/signup', async (req, res)=>{
    let check = await Users.findOne({email: req.body.email});
    if (check) {
        return res.status(400).json({success: false, errors: "User already exists"});
    }
    let cart = {};
    for (let i = 0; i < 300; i++){
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        cartData: cart,
    })

    await user.save();
    const data = {
        user: {id: user.id}
    }
    const token = jwt.sign(data, 'secret_ecom');
    res.json({success: true, token})
})

// Login
app.post('/login', async(req, res)=>{
    let user = await Users.findOne({email: req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if (passCompare){
            const data = {
                user: {id:user.id}
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({success: true, token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                cart: user.cart,
    },
            });
        }
        else{
            res.json({success: false, errors: 'Password incorrect'});
        }
    }
    else{
        res.json({success: false, errors: "Email invalid"})
    }
});

// Fetch User
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using valid token" });
  }

  try {
    const data = jwt.verify(token, 'secret_ecom');
    const user = await Users.findById(data.user.id);
    if (!user) {
      return res.status(401).send({ errors: "User not found" });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};

// Fetch All Users
app.get('/users', async (req, res) => {
  try {
    const users = await Users.find({}, '-password -__v');
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

// Delete Account
app.delete('/deleteaccount', fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedUser = await Users.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await Order.deleteMany({ userId });

    res.json({ success: true, message: "Account and orders deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ success: false, message: "Failed to delete account" });
  }
});

// Add to Cart
app.post('/addtocart', fetchUser, async (req, res) => {
    const { itemId, quantity } = req.body;
    console.log(req.body, req.user);

    try {
        let userData = await Users.findOne({ _id: req.user.id });

        const currentQty = userData.cartData[itemId] || 0;

        userData.cartData[itemId] = currentQty + quantity;

        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { cartData: userData.cartData }
        );

        res.send("Added");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding to cart");
    }
});

// Remove from Cart
app.post('/removefromcart', fetchUser, async(req, res)=>{
    (console.log("Removed", req.body.itemId))
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId]-=1;
    await Users.findOneAndUpdate({_id: req.user.id},{cartData:userData.cartData});
    res.send("Removed")
});

// Fetch Cart
app.get('/getcart', fetchUser, async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.user.id });
        const cartData = user.cartData || {};

        const productIds = Object.keys(cartData).map(id => Number(id));
        const products = await Product.find({ id: { $in: productIds } });

        const fullCart = products
    .map(prod => ({
        product: prod,
        quantity: cartData[prod.id] || 0
    }))
    .filter(entry => entry.quantity > 0);

        res.json(fullCart);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch cart");
    }
});

// Clear Cart
app.post('/clearcart', fetchUser, async (req, res) => {
    console.log("Cart cleared")
    try {
        await Users.findOneAndUpdate(
            { _id: req.user.id },
            { cartData: {} }
        );
        res.send("Cart cleared");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to clear cart");
    }
});

// Order Schema
const orderSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    items: {type: Array, required: true},
    amount: {type: Number, required: true},
    addressL1: {type: String, required: true},
    country: {type: String, required: true},
    city: {type: String, required: true},
    stateProv: {type: String, required: false},
    postalCode: {type: String, required: true},
    payMethod: {type: String, required: true},
    status: {type: String, required: true, default: 'Order Placed'},
    date: {type: Date, default: Date.now}
});

const Order = mongoose.model("Order", orderSchema);

app.post('/placeorder', fetchUser, async (req, res) => {
  try {
    const {
      items,
      amount,
      addressL1,
      country,
      city,
      stateProv,
      postalCode,
      payMethod
    } = req.body;

    const newOrder = new Order({
      userId: req.user.id,
      name: req.user.name,
      items,
      amount,
      addressL1,
      country,
      city,
      stateProv,
      postalCode,
      payMethod,
      status: 'Order Placed',
    });

    await newOrder.save();

    for (const item of items) {
      await Product.findOneAndUpdate(
        {id: item.productId},
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    res.json({ success: true, message: "Order placed successfully!" });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
});

// Fetch Orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
    console.log('Orders fetched')                  
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// Fetch One Order
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }
    console.log(`Order with ID ${order.id} fetched`);
    res.send(order);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});


// Update Order Status
app.post('/updatestatus/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order status updated successfully', order: updatedOrder });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Schema for Custom Boards
const Board = mongoose.model("Board", {
    id: {
        type: Number,
        required: true
    },
    name: { type: String, default: 'Custom Skimboard' },
    userId: {type: String, required: true},
    image: String,
    price: { type: Number, required: 200 },
    quantity: { type: Number, default: 1}

})

app.post('/addcustomboard', fetchUser, async (req, res) => {
    try {
        let boards = await Board.find({});
        let id = boards.length > 0 ? boards.slice(-1)[0].id + 1 : 1;

        const newBoard = new Board({
            id: id,
            name: req.user.name + "'s Custom Skimboard ",
            userId: req.user.id,
            image: req.body.image,
            price: 200,
            quantity: 1
        });

        await newBoard.save();

        res.json({ success: true, board: newBoard });
    } catch (error) {
        console.error("Error adding custom board:", error);
        res.status(500).json({ success: false, message: "Failed to add custom board" });
    }
});


app.listen(port, (error) => {
    if (!error){
        console.log("Server running on Port " +port)
    } 
    else {
        console.log("Error: "+error)
    }
})