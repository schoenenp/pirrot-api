const express = require('express');
const {check} = require('express-validator'); // for signup validation
const materialsControllers = require('../controllers/materials-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/', materialsControllers.getMaterials);
router.get('/:cid', materialsControllers.getMaterialById);


router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!
router.post('/',[
    check('title').not().isEmpty()
], materialsControllers.createMaterial);
router.patch('/:cid', materialsControllers.updateMaterial);
router.delete('/:cid', materialsControllers.deleteMaterial);


module.exports = router;