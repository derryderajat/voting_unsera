module.exports = (app) => {
  const router = require('express').Router();
  const Room = require('../controllers/roomController');
  // const User = require('../controllers/userController');

  router.get('/', Room.findRoom);
  router.post('/', Room.createRoom);
  router.put('/', Room.voting);
  app.use('/api/room', router);
};
