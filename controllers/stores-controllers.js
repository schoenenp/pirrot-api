const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');

const Store = require('../models/store');

const getStores = async (req,res,next) =>{
    let stores;
    try{
        stores = await Store.find({});
    }catch(err){
        const error = new HttpError(
            'Fetching Stores failed, please try again later.',
            500
        )
        return next(error)
    }
    
    res.json({ stores: stores.map(store => store.toObject({ getters: true }))});
}
const getStoreById = async (req,res,next) => {
    const storeId = req.params.cid;
    let store;
    try{
        store =  await Store.findById(storeId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a store.',
            500
        );
        return next(error);
    }
    if(!store){
        const error = new HttpError(
            'Could not find a store for the provided id.',
            404
        );
        return next(error);
    }
    res.json({store: store.toObject({getters:true})});
}

const createStore = async (req,res,next) => {
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
      const {title, contact, status} = req.body;


      const createdStore = new Store({
          title,
          contact,
          status,
          team:null,
          products:[],
          orders:[],
          hours:[]
      });
      
      if(req.body.hours && req.body.hours ==! null){
        return createdStore.hours = req.body.hours
      }
      console.log(createdStore)
      try{
          const sess = await mongoose.startSession();
          sess.startTransaction();
          await createdStore.save({session:sess});
          await sess.commitTransaction();
      }catch(err){
        const error = new HttpError('Creating store failed, please try again', 500);
        return next(error);
    }
res.status(201).json({store: createdStore.toObject({getters:true})});
}


const updateStore = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.',422)
        );
    }
    const {title, contact, status} = req.body;
  
    const storeId = req.params.cid;
    let store;
    try{
        store = await Store.findById(storeId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update store',500
        );
        return next(error);
    }

    store.title = title
    store.contact = contact
    store.status = status
    

    try{
        await store.save();
    }catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update store.',500
        );
        return next(error);
    }
    res.status(200).json({store: store.toObject({getters:true})});
}


const deleteStore = async (req, res, next) => {
    const storeId = req.params.cid;

    let store;
    try{
        store = await Store.findById(storeId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete store.',
            500
        );
        return next(error)
    }
    if(!store){
        const error = new HttpError('Could not find store for this id.', 404);
        return next(error);
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await store.remove({session:sess });
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete store.',
            500
        );
        return next(error);
    }
    res.status(200).json({message: 'Store deleted.'});
}


exports.getStores = getStores;
exports.getStoreById = getStoreById;
exports.createStore = createStore;
exports.updateStore = updateStore;
exports.deleteStore = deleteStore;