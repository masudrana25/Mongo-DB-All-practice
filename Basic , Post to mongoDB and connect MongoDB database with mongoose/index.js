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

app.get('/', (req, res) => {
  res.send('Welcome to Home Page')
});

//Form thekey data load korley

app.post('/products', async (req, res) => {
  try {
    const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
  });
  await product.save();
  res.status(201).send(product);
  } catch (error) {
    res.status(500).send({message : error.message});
  }
})

// nijey input diley
// app.post('/products', async (req, res) => {
//   try {
//     const product = await Product.insertMany([
//       {
//         title: 'iphone 22',
//         price: 33,
//         description: ' Very good product'
//       },
//       {
//         title: 'iphone 23',
//         price: 34,
//         description: ' Very good product'
//       },
//       {
//         title: 'iphone 24',
//         price: 35,
//         description: ' Very good product'
//       }
//     ]);
//     res.status(201).send(product);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

// get all data from database
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
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

// get one specific data from database
app.get('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.find({ _id: id }); //product er sob details dekhaby

    //product ta k array hisey output diby
    // const product = await Product.find({ _id: id }).select({
    //   title: 1,
    //   price: 1,
    //   _id : 0
    // });

    // akta object hiseybey output dibey
    //  const product = await Product.findOne({ _id: id }).select({
    //   title: 1,
    //   price: 1,
    //   _id : 0
    // });
      //  const product = await Product.findOne({ _id: id }, {title: 1, _id : 0, price: 1});
    if (product) {
      res.status(201).send({
        success: true,
        message: 'return single product',
        data : product
      });
    } else {
      res.status(404).send({
        success : true,
        message: 'Product not found',
      })
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

