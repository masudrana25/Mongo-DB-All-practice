const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

 //Creating Schema
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'title must be provided'],
    minlength : [3, ' titles must be grater than 3 digit'],
    maxlength : [10, 'titles must be less than 10 digit'],
    trim: true,
    enum: {
      values: ['iphone', 'Nokia'],
      message : ' {VALUE} is not supported as title value'
    },
  },
  price: {
    type: Number,
    required: true,
    max: [2000, ' Price must be less than 2000'],
    min: [200, ' Price must be greater than 200']
  },
  rating: {
    type: Number,
    required: true
  },
  // email: {
  //   type: String, 
  //   unique: true,
  // },
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


// post data to database
app.post('/products', async (req, res) => {
  try {
    const product = new Product({
      title: req.body.title,
      price: req.body.price,
      rating: req.body.rating,
      // email : req.body.email,
      description: req.body.description
    });
    await product.save();

    if (product) {
      res.status(201).send({
        success: true,
        message: 'Posted a new Product successfully',
        data : product
    });
    } else {
      res.status(404).send({
        success : true,
        message: 'Posted a new Product is not successfully',
      })
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


// get all data from database
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({price : 1});

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

