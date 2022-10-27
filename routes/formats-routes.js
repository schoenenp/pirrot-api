const express = require('express');
const {check} = require('express-validator'); // for signup validation
const formatsControllers = require('../controllers/formats-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/', formatsControllers.getFormats);
router.get('/:cid', formatsControllers.getFormatById);


router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!
router.post('/',[
    check('title').not().isEmpty()
], formatsControllers.createFormat);
router.patch('/:cid', formatsControllers.updateFormat);
router.delete('/:cid', formatsControllers.deleteFormat);


module.exports = router;