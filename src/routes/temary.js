const router = require('express').Router();


// create One Temary
const {CreateOneTemary,AddItemstoSublevel} = require('../controllers/ControllerTemary/temaryController')
router.post('/temary/createOne',CreateOneTemary);
router.post('/temary/addItemContent', AddItemstoSublevel)


module.exports = router;