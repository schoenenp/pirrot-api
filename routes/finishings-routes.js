const express = require('express');
const {check} = require('express-validator'); // for signup validation
const finishingsControllers = require('../controllers/finishings-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/', finishingsControllers.getFinishings);
router.get('/:cid', finishingsControllers.getFinishingById);


router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!
router.post('/',[
    check('title').not().isEmpty()
], finishingsControllers.createFinishing);
router.patch('/:cid', finishingsControllers.updateFinishing);
router.delete('/:cid', finishingsControllers.deleteFinishing);


module.exports = router;