const fs = require("fs");
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');

const Product = require('../models/product');
const User = require('../models/user');

const getProducts = async (req,res,next) =>{
    let products;
    try{
        products = await Product.find({}).populate('categories').sort({body:1});
    }catch(err){
        const error = new HttpError(
            'Fetching Products failed, please try again later.',
            500
        )
    }
    
    res.json({ products: products.map(product => product.toObject({ getters: true }))});
}

const getProductById = async (req, res, next) => {
    const productId = req.params.pid;

    let product;
    try{
        product = await Product.findById(productId).populate('category','title');
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a product.',
            500
        );
        return next(error);
    }
    if(!product){
        const error = new HttpError(
            'Could not find a product for the provided id.',
            404
        );
        return next(error);
    }
    res.json({product: product.toObject({getters:true})});
}

  
  const createProduct = async(req, res, next) =>{
    
      const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }

      const {title, description, categories} = req.body;
      console.log("body: ", req.body)
      const createdProduct = new Product({

          title,
          description,
          categories,
          variants: [],
          image: req.file.path

      });

      
    
      try{
          const sess = await mongoose.startSession();
          sess.startTransaction();
          await createdProduct.save({session:sess});
          await sess.commitTransaction();
      }catch(err){
          const error = new HttpError('Creating product failed, please try again', 500);
          return next(error);
      }
res.status(201).json({product: createdProduct});
  }

  const getProductByTitle = async (req,res,next) => {
    const productTitle = req.params.pt;
    let product;
    try{ 
        product = await Product.findOne({title: productTitle});
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a product.',
            500
        );
        return next(error)
    }

    if(!product){
        const error = new HttpError(
            'Could not find a product for the provided title.',
            404
        );
        return next(error);
    }
    res.json({ID: product.id});
}

const updateProduct = async (req, res, next) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const {title, description, category} = req.body;
  const productId = req.params.pid;

  let product;
  try{
    product = await Product.findById(productId);
  }catch(err){
    const error = new HttpError(
      'Something went wrong, could not update product.',
      500
    );
    return next(error);
  }

  product.title = title;
  product.description = description;
  product.category = category;

  try{
    await product.save();
  }catch(err){
    const error = new HttpError(
      'Something went wrong, could not update product.',
      500
    );
    return next(error);
  }
  res.status(200).json({product: product.toObject({getters: true})});
}


const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try{
    product = await Product.findById(productId);
  }catch(err){
    const error = new HttpError(
      'Something went wrong, could not delete product.',
      500
    );
    return next(error);
  }

  if(!product){
    const error = new HttpError('Could not find product for this id.',404);
    return next(error);
  }

  const imagePath = product.image;
  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.remove({session:sess});
    await sess.commitTransaction();
  }catch(err){
    const error = new HttpError(
      'Something went wrong, could not delete product.',
      500
    );
    return next(error);
  }
  
  fs.unlink(imagePath, err => {
    const error = new HttpError(
      'Something went wrong, could not delete product image.',
      500
    );
    return next(error);
  })

  res.status(200).json({message: 'Deleted product.'});
}

exports.deleteProduct = deleteProduct;
exports.updateProduct = updateProduct;
exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.getProductByTitle = getProductByTitle;
exports.getProductById = getProductById;
