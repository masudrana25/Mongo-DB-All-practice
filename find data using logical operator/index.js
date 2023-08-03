const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

 //Creating Schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  Created_at: {
    type: Date,
    default: Date.now(),
  }
});

// creating product Model
const Product = mongoose.model("Products", productSchema);


const connectToDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/testProductDB');
    console.log('DB is connected');
  } catch (error) {
    console.log('DB is not connected');
    console.log(error);
    process.exit(1);
  }
};

app.listen(3000, async () => {
  console.log('Server Running Successfully');
  await connectToDB();
});



// get all data from database
app.get('/products', async (req, res) => {
  try {
    
    // const products = await Product.find({ $and: [{ price: { $lt: 45 } }, { rating: { $gt: 4 } }] });
    // const products = await Product.find({ $or: [{ price: { $lt: 35 } }, { rating: { $gt: 4.8 } }] });
    // const products = await Product.find({ price: { $not: { $gt: 35 } } });
    const products = await Product.find({ $nor: [{ price: { $lt: 45 } }, { rating: { $lt: 4.5 } }] });
    
    if (products) {
      res.status(201).send({
        success: true,
        message: 'return all products',
        data : products
    });
    } else {
      res.status(404).send({
        success : true,
        message: 'Products not found',
      })
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

