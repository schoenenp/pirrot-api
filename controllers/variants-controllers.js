const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');

const Variant = require('../models/variant');
const Product = require('../models/product');

const getVariants = async (req,res,next) =>{
    let variants;
    try{
        variants = await Variant.find({});
    }catch(err){
        const error = new HttpError(
            'Fetching variants failed, please try again later.',
            500
        )
        return next(error)
    }
    
    res.json({ variants: variants.map(variant => variant.toObject({ getters: true }))});
}
const getVariantById = async (req,res,next) => {
    const variantId = req.params.cid;
    let variant;
    try{
        variant =  await Variant.findById(variantId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a variant.',
            500
        );
        return next(error);
    }
    if(!variant){
        const error = new HttpError(
            'Could not find a variant for the provided id.',
            404
        );
        return next(error);
    }
    res.json({variant: variant.toObject({getters:true})});
}

const createVariant = async (req,res,next) => {
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
      const {material, color, format, scales, product} = req.body;


      const createdVariant = new Variant({
         material,
         color,
         format,
         scales,
         product
      });

      let existingProduct;

      try{
        existingProduct = await Product.findById(product);
      }catch(err){
          const error = new HttpError(
              'Creating post failed, please try again.',
              500
          );
          return next(error);
      }

      if(!existingProduct){
        const error = new HttpError('could not find a user for the provided product id.', 404);
        return next(error);
      } 

      try{
          const sess = await mongoose.startSession();
          sess.startTransaction();
          await createdVariant.save({session:sess});
          existingProduct.variants.push(createdVariant);
          await existingProduct.save({session:sess});
          await sess.commitTransaction();
      }catch(err){
        const error = new HttpError('Creating variant failed, please try again', 500);
        return next(error);
    }
res.status(201).json({variant: createdVariant.toObject({getters:true})});
}


const updateVariant = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.',422)
        );
    }
    const { scales } = req.body;
  
    const variantId = req.params.cid;
    let variant;
    try{
        variant = await Variant.findById(variantId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update variant',500
        );
        return next(error);
    }

    variant.scales = scales
    

    try{
        await variant.save();
    }catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update variant.',500
        );
        return next(error);
    }
    res.status(200).json({variant: variant.toObject({getters:true})});
}


const deleteVariant = async (req, res, next) => {
    const variantId = req.params.cid;

    let variant;
    try{
        variant = await Variant.findById(variantId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete variant.',
            500     
        );
        return next(error)
    }
    if(!variant){
        const error = new HttpError('Could not find variant for this id.', 404);
        return next(error);
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await variant.remove({session:sess });
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete variant.',
            500
        );
        return next(error);
    }
    res.status(200).json({message: 'Deleted variant.'});
}


exports.getVariants = getVariants;
exports.getVariantById = getVariantById;
exports.createVariant = createVariant;
exports.updateVariant = updateVariant;
exports.deleteVariant = deleteVariant;