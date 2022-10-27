const express = require('express');
const {check} = require('express-validator'); // for signup validation
const hoursControllers = require('../controllers/hours-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('/', hoursControllers.getHours);
router.get('/:cid', hoursControllers.getHourById);


router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!
router.post('/',[
    check('title').not().isEmpty()
], hoursControllers.createHour);
router.patch('/:cid', hoursControllers.updateHour);
router.delete('/:cid', hoursControllers.deleteHour);


module.exports = router;