const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');

const Format = require('../models/format');

const getFormats = async (req,res,next) =>{
    let formats;
    try{
        formats = await Format.find({});
    }catch(err){
        const error = new HttpError(
            'Fetching Formats failed, please try again later.',
            500
        )
        return next(error)
    }
    
    res.json({ formats: formats.map(format => format.toObject({ getters: true }))});
}
const getFormatById = async (req,res,next) => {
    const formatId = req.params.cid;
    let format;
    try{
        format =  await Format.findById(formatId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a format.',
            500
        );
        return next(error);
    }
    if(!format){
        const error = new HttpError(
            'Could not find a format for the provided id.',
            404
        );
        return next(error);
    }
    res.json({format: format.toObject({getters:true})});
}

const createFormat = async (req,res,next) => {
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
      const {title, width, height, factor} = req.body;


      const createdFormat = new Format({
          title,
          width,
          height,
          factor
      });
      
      try{
          const sess = await mongoose.startSession();
          sess.startTransaction();
          await createdFormat.save({session:sess});
          await sess.commitTransaction();
      }catch(err){
        const error = new HttpError('Creating format failed, please try again', 500);
        return next(error);
    }
res.status(201).json({format: createdFormat.toObject({getters:true})});
}


const updateFormat = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.',422)
        );
    }
    const {title, width, height, factor} = req.body;
  
    const formatId = req.params.cid;
    let format;
    try{
        format = await Format.findById(formatId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update format',500
        );
        return next(error);
    }

    format.title = title
    format.width = width
    format.height = height
    format.factor = factor
    

    try{
        await format.save();
    }catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update format.',500
        );
        return next(error);
    }
    res.status(200).json({format: format.toObject({getters:true})});
}


const deleteFormat = async (req, res, next) => {
    const formatId = req.params.cid;

    let format;
    try{
        format = await Format.findById(formatId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete format.',
            500
        );
        return next(error)
    }
    if(!format){
        const error = new HttpError('Could not find format for this id.', 404);
        return next(error);
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await format.remove({session:sess });
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete format.',
            500
        );
        return next(error);
    }
    res.status(200).json({message: 'Format deleted.'});
}


exports.getFormats = getFormats;
exports.getFormatById = getFormatById;
exports.createFormat = createFormat;
exports.updateFormat = updateFormat;
exports.deleteFormat = deleteFormat;