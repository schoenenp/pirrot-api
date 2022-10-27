const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');

const Finishing = require('../models/finishing');

const getFinishings = async (req,res,next) =>{
    let finishings;
    try{
        finishings = await Finishing.find({});
    }catch(err){
        const error = new HttpError(
            'Fetching Finishings failed, please try again later.',
            500
        )
        return next(error)
    }
    
    res.json({ finishings: finishings.map(finishing => finishing.toObject({ getters: true }))});
}
const getFinishingById = async (req,res,next) => {
    const finishingId = req.params.cid;
    let finishing;
    try{
        finishing =  await Finishing.findById(finishingId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a finishing.',
            500
        );
        return next(error);
    }
    if(!color){
        const error = new HttpError(
            'Could not find a finishing for the provided id.',
            404
        );
        return next(error);
    }
    res.json({finishing: finishing.toObject({getters:true})});
}

const createFinishing = async (req,res,next) => {
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
      const {title, description, factor} = req.body;


      const createdFinishing = new Finishing({
          title,
          description,
          factor
      });
      console.log(createdFinishing);
      try{
          const sess = await mongoose.startSession();
          sess.startTransaction();
          await createdFinishing.save({session:sess});
          await sess.commitTransaction();
      }catch(err){
        const error = new HttpError('Creating finishing failed, please try again', 500);
        return next(error);
    }
res.status(201).json({finishing: createdFinishing.toObject({getters:true})});
}


const updateFinishing = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.',422)
        );
    }
    const {title, description, factor} = req.body;
  
    const finishingId = req.params.cid;
    let finishing;
    try{
        finishing = await Finishing.findById(finishingId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update finishing',500
        );
        return next(error);
    }

    finishing.title = title
    finishing.description = description
    finishing.factor = factor
    

    try{
        await finishing.save();
    }catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update finishing.',500
        );
        return next(error);
    }
    res.status(200).json({finishing: finishing.toObject({getters:true})});
}


const deleteFinishing = async (req, res, next) => {
    const finishingId = req.params.cid;

    let finishing;
    try{
        finishing = await Finishing.findById(finishingId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete finishing.',
            500
        );
        return next(error)
    }
    if(!finishing){
        const error = new HttpError('Could not find finishing for this id.', 404);
        return next(error);
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await finishing.remove({session:sess });
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete finishing.',
            500
        );
        return next(error);
    }
    res.status(200).json({message: 'Finishing color.'});
}


exports.getFinishings = getFinishings;
exports.getFinishingById = getFinishingById;
exports.createFinishing = createFinishing;
exports.updateFinishing = updateFinishing;
exports.deleteFinishing = deleteFinishing;