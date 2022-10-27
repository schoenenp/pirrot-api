const fs = require('fs');
const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const HttpError = require('./models/http-error');

const usersRoutes = require('./routes/users-routes');
const postsRoutes = require('./routes/posts-routes');
const productsRoutes = require('./routes/products-routes');
const categoriesRoutes = require('./routes/categories-routes');
const materialsRoutes = require('./routes/materials-routes');
const colorsRoutes = require('./routes/colors-routes');
const finishingsRoutes = require('./routes/finishings-routes');
const formatsRoutes = require('./routes/formats-routes');
const hoursRoutes = require('./routes/hours-routes');
const storesRoutes = require('./routes/stores-routes');
const variantsRoutes = require('./routes/variants-routes');


const app = express();
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req,res, next)=> {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});

app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/colors', colorsRoutes);
app.use('/api/finishings', finishingsRoutes);
app.use('/api/formats', formatsRoutes);
app.use('/api/hours', hoursRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/variants', variantsRoutes);

app.use((req,res,next)=>{
    const error = new HttpError("Could not find this route", 404);
    throw error;
});

app.use((error, req, res, next)=> {
    if (req.file) {
        fs.unlink(req.file.path, err => {
          console.log(err);
        });
      }
    if(res.headerSent){
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || "An unknown error occured!"});
});

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.athejsz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    ,{ useNewUrlParser: true, useUnifiedTopology: true  })
.then(()=>{
    app.listen(process.env.PORT || 9001);
    console.log('Server is running over 9000!')
})
.catch(err=>{
    console.log(err);
});

