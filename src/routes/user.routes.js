const express = require('express');
const router = express.Router();

const ctrls = require('../controllers');

// router.post('/register', ctrls.user.register);
// router.post('/login', ctrls.user.login);
router.get('/test', ctrls.user.test);
// router.get('/deck/:user', ctrls.user.getDeck);
// router.put('/deck/add/:user/:card', ctrls.user.addCardToDeck);
// router.put('/deck/rem/:user/:card', ctrls.user.removeCardFromDeck);
// router.put('/deck/toggle/:user/:card', ctrls.user.toggleCard);
// router.put('/friend/add/:user/:id', ctrls.user.addFriend);
// router.put('/friend/rem/:user/:id', ctrls.user.removeFriend);
// router.delete('/destroy/:user', ctrls.user.destroy);

module.exports = router;
