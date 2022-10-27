const express = require('express');
const {check} = require('express-validator'); // for signup validation
const variantsControllers = require('../controllers/variants-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/', variantsControllers.getVariants);
router.get('/:cid', variantsControllers.getVariantById);

router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!
router.post('/',[
    check('title').not().isEmpty()
], variantsControllers.createVariant);
router.patch('/:cid', variantsControllers.updateVariant);
router.delete('/:cid', variantsControllers.deleteVariant);


module.exports = router;