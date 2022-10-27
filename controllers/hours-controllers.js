const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');

const Hour = require('../models/hour');

const getHours = async (req,res,next) =>{
    let hours;
    try{
        hours = await Hour.find({});
    }catch(err){
        const error = new HttpError(
            'Fetching Hours failed, please try again later.',
            500
        )
        return next(error)
    }
    
    res.json({ hours: hours.map(hour => hour.toObject({ getters: true }))});
}
const getHourById = async (req,res,next) => {
    const hourId = req.params.cid;
    let hour;
    try{
      hour =  await Hour.findById(hourId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a hour.',
            500
        );
        return next(error);
    }
    if(!hour){
        const error = new HttpError(
            'Could not find a hour for the provided id.',
            404
        );
        return next(error);
    }
    res.json({hour: hour.toObject({getters:true})});
}

const createHour = async (req,res,next) => {
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
      const {title, times, store} = req.body;


      const createdHour = new Hour({
          title,
          times,
          store
      });
    
      let existingStore;

      try{
        existingStore = await Store.findById(store);
      }catch(err){
          const error = new HttpError(
              'Creating hours failed, please try again.',
              500
          );
          return next(error);
      }

      if(!existingStore){
        const error = new HttpError('could not find a store for the provided store id.', 404);
        return next(error);
      }
    
      try{
          const sess = await mongoose.startSession();
          sess.startTransaction();
          await createdHour.save({session:sess});
          existingStore.hours.push(createdHour);
          await existingStore.save({session:sess});
          await sess.commitTransaction();
      }catch(err){
          const error = new HttpError('Creating post failed, please try again', 500);
          return next(error);
      }
res.status(201).json({hour: createdHour.toObject({getters:true})});
}


const updateHour = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.',422)
        );
    }
    const {title, times} = req.body;
  
    const hourId = req.params.cid;
    let hour;
    try{
        hour = await Hour.findById(hourId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update hour',500
        );
        return next(error);
    }

    hour.title = title
    hour.times = times
    

    try{
        await hour.save();
    }catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update hour.',500
        );
        return next(error);
    }
    res.status(200).json({hour: hour.toObject({getters:true})});
}


const deleteHour = async (req, res, next) => {
    const hourId = req.params.cid;

    let hour;
    try{
        hour = await Hour.findById(hourId).populate('store');
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete hour.',
            500
        );
        return next(error)
    }
    if(!hour){
        const error = new HttpError('Could not find hour for this id.', 404);
        return next(error);
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await hour.remove({session:sess });
        hour.store.hours.pull(hour);
        await hour.store.save({session:sess});
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete hour.',
            500
        );
        return next(error);
    }
    res.status(200).json({message: 'Deleted hour.'});
}


exports.getHours = getHours;
exports.getHourById = getHourById;
exports.createHour = createHour;
exports.updateHour = updateHour;
exports.deleteHour = deleteHour;