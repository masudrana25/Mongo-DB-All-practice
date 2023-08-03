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
    const products = await Product.find({price : {$eq : 40}});
    // const products = await Product.find({price : {$ne : 40}});
    // const products = await Product.find({price : {$gt : 40}});
    // const products = await Product.find({price : {$gte : 40}});
    // const products = await Product.find({price : {$lt : 40}});
    // const products = await Product.find({price : {$lte : 40}});
    // const products = await Product.find({ price: { $in: [33, 22, 44, 55] } });
    // const products = await Product.find({price : {$nin : [33,22,44,55]}});
    
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

