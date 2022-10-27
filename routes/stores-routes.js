const express = require('express');
const {check} = require('express-validator'); // for signup validation
const storesControllers = require('../controllers/stores-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/', storesControllers.getStores);
router.get('/:cid', storesControllers.getStoreById);


router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!
router.post('/',[
    check('title').not().isEmpty()
], storesControllers.createStore);
router.patch('/:cid', storesControllers.updateStore);
router.delete('/:cid', storesControllers.deleteStore);


module.exports = router;