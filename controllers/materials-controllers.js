const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');

const Material = require('../models/material');

const getMaterials = async (req,res,next) =>{
    let materials;
    try{
        materials = await Material.find({});
    }catch(err){
        const error = new HttpError(
            'Fetching Materials failed, please try again later.',
            500
        )
        return next(error)
    }
    
    res.json({ materials: materials.map(material => material.toObject({ getters: true }))});
}
const getMaterialById = async (req,res,next) => {
    const materialId = req.params.cid;
    let material;
    try{
        material =  await Material.findById(materialId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a material.',
            500
        );
        return next(error);
    }
    if(!color){
        const error = new HttpError(
            'Could not find a material for the provided id.',
            404
        );
        return next(error);
    }
    res.json({material: material.toObject({getters:true})});
}

const createMaterial = async (req,res,next) => {
    const errors = validationResult(req);
      if(!errors.isEmpty()){
          return next(
              new HttpError('Invalid inputs passed, please check your data.',422)
          );
      }
      const {title, description, weight, factor} = req.body;


      const createdMaterial = new Material({
          title,
          description,
          weight,
          factor
      });
      console.log(createdMaterial);
      try{
          const sess = await mongoose.startSession();
          sess.startTransaction();
          await createdMaterial.save({session:sess});
          await sess.commitTransaction();
      }catch(err){
        const error = new HttpError('Creating material failed, please try again', 500);
        return next(error);
    }
res.status(201).json({material: createdMaterial.toObject({getters:true})});
}


const updateMaterial = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please check your data.',422)
        );
    }
    const {title, description, weight, factor} = req.body;
  
    const materialId = req.params.cid;
    let material;
    try{
        material = await Material.findById(materialId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update material',500
        );
        return next(error);
    }

    material.title = title
    material.description = description
    material.weight = weight
    material.factor = factor
    

    try{
        await material.save();
    }catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update material.',500
        );
        return next(error);
    }
    res.status(200).json({material: material.toObject({getters:true})});
}


const deleteMaterial = async (req, res, next) => {
    const materialId = req.params.cid;

    let material;
    try{
        material = await Material.findById(materialId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete material.',
            500
        );
        return next(error)
    }
    if(!material){
        const error = new HttpError('Could not find material for this id.', 404);
        return next(error);
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await material.remove({session:sess });
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete material.',
            500
        );
        return next(error);
    }
    res.status(200).json({message: 'Material color.'});
}


exports.getMaterials = getMaterials;
exports.getMaterialById = getMaterialById;
exports.createMaterial = createMaterial;
exports.updateMaterial = updateMaterial;
exports.deleteMaterial = deleteMaterial;