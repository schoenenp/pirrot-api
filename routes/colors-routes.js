const express = require('express');
const {check} = require('express-validator'); // for signup validation
const colorsControllers = require('../controllers/colors-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/', colorsControllers.getColors);
router.get('/:cid', colorsControllers.getColorById);


router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!
router.post('/',[
    check('title').not().isEmpty()
], colorsControllers.createColor);
router.patch('/:cid', colorsControllers.updateColor);
router.delete('/:cid', colorsControllers.deleteColor);


module.exports = router;