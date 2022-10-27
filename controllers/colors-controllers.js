const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');

const Color = require('../models/color');

const getColors = async (req,res,next) =>{
    let colors;
    try{
        colors = await Color.find({});
    }catch(err){
        const error = new HttpError(
            'Fetching Colors failed, please try again later.',
            500
        )
        return next(error)
    }
    
    res.json({ colors: colors.map(color => color.toObject({ getters: true }))});
}
const getColorById = async (req,res,next) => {
    const colorId = req.params.cid;
    let color;
    try{
      color =  await Color.findById(colorId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a color.',
            500
        );
        return next(error);
    }
    if(!color){
        const error = new HttpError(
            'Could not find a color for the provided id.',
            404
        );
        return next(error);
    }
    res.json({color: color.toObject({getters:true})});
}

const createColor = async (req,res,next) => {
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
      const {title, description, hex, factor} = req.body;


      const createdColor = new Color({
          title,
          description,
          hex,
          factor
      });
      console.log(createdColor);
      try{
          const sess = await mongoose.startSession();
          sess.startTransaction();
          await createdColor.save({session:sess});
          await sess.commitTransaction();
      }catch(err){
        const error = new HttpError('Creating color failed, please try again', 500);
        return next(error);
    }
res.status(201).json({color: createdColor.toObject({getters:true})});
}


const updateColor = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.',422)
        );
    }
    const {title, description, hex, factor} = req.body;
  
    const colorId = req.params.cid;
    let color;
    try{
        color = await Color.findById(colorId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update color',500
        );
        return next(error);
    }

    color.title = title
    color.description = description
    color.hex = hex
    color.factor = factor
    

    try{
        await color.save();
    }catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update color.',500
        );
        return next(error);
    }
    res.status(200).json({color: color.toObject({getters:true})});
}


const deleteColor = async (req, res, next) => {
    const colorId = req.params.cid;

    let color;
    try{
        color = await Color.findById(colorId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete color.',
            500
        );
        return next(error)
    }
    if(!color){
        const error = new HttpError('Could not find color for this id.', 404);
        return next(error);
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await color.remove({session:sess });
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete color.',
            500
        );
        return next(error);
    }
    res.status(200).json({message: 'Deleted color.'});
}


exports.getColors = getColors;
exports.getColorById = getColorById;
exports.createColor = createColor;
exports.updateColor = updateColor;
exports.deleteColor = deleteColor;