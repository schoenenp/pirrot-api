const express = require('express');
const {check} = require('express-validator'); // for signup validation
const productsControllers = require('../controllers/products-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const fileUpload = require('../middleware/file-upload');




router.get('/', productsControllers.getProducts);
router.get('/:pid', productsControllers.getProductById);
router.get('/title/:pt', productsControllers.getProductByTitle);

router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!  

router.post('/',
    fileUpload.single('image'),
    [
    check('description').not().isEmpty(),
    ],
    productsControllers.createProduct
    );

router.patch('/:pid', productsControllers.updateProduct);
router.delete('/:pid', productsControllers.deleteProduct);


module.exports = router;